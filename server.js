const express = require('express');
const { execFile } = require('child_process');
const util = require('util');
const execFileAsync = util.promisify(execFile);
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const app = express();
app.use(express.json({ limit: '10mb' }));

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { timeout: 10000 }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    });
    req.on('timeout', () => {
      req.destroy(new Error(`Download timed out: ${url}`));
    });
    req.on('error', (err) => {
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
  });
}

// Relocates the moov atom to the front of the file ("faststart") so video
// players can read duration/metadata without scanning the whole file.
// Giphy's exported MP4s have moov at the end, which causes Chrome/Remotion
// to hang trying to read duration. -c copy means no re-encoding happens.
async function faststartRemux(inputPath) {
  const tempPath = inputPath + '.faststart.mp4';
  await execFileAsync('ffmpeg', [
    '-i', inputPath,
    '-c', 'copy',
    '-movflags', 'faststart',
    '-y',
    tempPath,
  ], { timeout: 30000 });
  fs.renameSync(tempPath, inputPath);
}

app.post('/render', async (req, res) => {
  const jobStart = Date.now();
  const data = req.body;
  const id = Date.now();
  console.log(`[${id}] === NEW RENDER REQUEST ===`);
  console.log(`[${id}] BODY RECEIVED:`, JSON.stringify(data).slice(0, 300));

  const propsPath = path.join(__dirname, `props-${id}.json`);
  const outPath = path.join(__dirname, `out/video-${id}.mp4`);
  const gifDir = path.join(__dirname, 'public', 'tmp-gifs', `${id}`);

  fs.mkdirSync(path.join(__dirname, 'out'), { recursive: true });
  fs.mkdirSync(gifDir, { recursive: true });

  try {
    const gifKeys = ['gifHook', 'gifMatch', 'gifBet', 'gifPayout', 'gifCta'];
    for (const key of gifKeys) {
      if (data[key]) {
        const filename = `${key}.mp4`;
        const localPath = path.join(gifDir, filename);
        const dlStart = Date.now();
        console.log(`[${id}] Downloading ${key} from ${data[key]}`);
        await downloadFile(data[key], localPath);
        const size = fs.existsSync(localPath) ? fs.statSync(localPath).size : 0;
        console.log(`[${id}] Downloaded ${key} in ${Date.now() - dlStart}ms, ${size} bytes`);

        const remuxStart = Date.now();
        await faststartRemux(localPath);
        console.log(`[${id}] Remuxed ${key} (faststart) in ${Date.now() - remuxStart}ms`);

        data[key] = `tmp-gifs/${id}/${filename}`;
      }
    }
    console.log(`[${id}] All GIFs downloaded. Total download time: ${Date.now() - jobStart}ms`);

    fs.writeFileSync(propsPath, JSON.stringify(data));
    console.log(`[${id}] Props written to ${propsPath}`);

    const renderStart = Date.now();
    console.log(`[${id}] Starting Remotion render...`);
    await execFileAsync('npx', [
      'remotion', 'render',
      'src/index.ts',
      'SoccerVideo',
      outPath,
      `--props=${propsPath}`,
      '--concurrency=1',
      '--timeout=30000',
    ], { cwd: __dirname, timeout: 600000 });
    console.log(`[${id}] Render finished in ${Date.now() - renderStart}ms`);

    res.download(outPath, `video-${id}.mp4`, () => {
      console.log(`[${id}] File sent to n8n, cleaning up. Total job time: ${Date.now() - jobStart}ms`);
      fs.unlinkSync(outPath);
      fs.unlinkSync(propsPath);
      fs.rmSync(gifDir, { recursive: true });
      console.log(`[${id}] === DONE ===`);
    });
  } catch (err) {
    console.error(`[${id}] FAILED after ${Date.now() - jobStart}ms:`, err.message);
    if (fs.existsSync(propsPath)) fs.unlinkSync(propsPath);
    if (fs.existsSync(gifDir)) fs.rmSync(gifDir, { recursive: true });
    res.status(500).json({ error: err.message });
  }
});

const server = app.listen(3001, '0.0.0.0', () => {
  console.log('Render server on http://0.0.0.0:3001');
});
server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});