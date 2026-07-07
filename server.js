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

function formatPst(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
    hour12: false,
    timeZoneName: 'short',
  }).formatToParts(date);

  const get = (type) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}:${get('second')}.${get('fractionalSecond') || '000'} ${get('timeZoneName')}`;
}

function log(...args) {
  console.log(`[${formatPst()}]`, ...args);
}

function logError(...args) {
  console.error(`[${formatPst()}]`, ...args);
}

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
  log('=== NEW RENDER REQUEST ===');
  log('BODY RECEIVED:', JSON.stringify(data).slice(0, 300));

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
        log(`Downloading ${key} from ${data[key]}`);
        await downloadFile(data[key], localPath);
        const size = fs.existsSync(localPath) ? fs.statSync(localPath).size : 0;
        log(`Downloaded ${key} in ${Date.now() - dlStart}ms, ${size} bytes`);

        const remuxStart = Date.now();
        await faststartRemux(localPath);
        log(`Remuxed ${key} (faststart) in ${Date.now() - remuxStart}ms`);

        data[key] = `tmp-gifs/${id}/${filename}`;
      }
    }
    log(`All GIFs downloaded. Total download time: ${Date.now() - jobStart}ms`);

    fs.writeFileSync(propsPath, JSON.stringify(data));
    log(`Props written to ${propsPath}`);

    const renderStart = Date.now();
    log('Starting Remotion render...');
    await execFileAsync('npx', [
      'remotion', 'render',
      'src/index.ts',
      'SoccerVideo',
      outPath,
      `--props=${propsPath}`,
      '--codec=h264',
      '--crf=12',
      '--image-format=png',
      '--pixel-format=yuv420p',
      '--x264-preset=slow',
      '--concurrency=1',
      '--timeout=30000',
    ], { cwd: __dirname, timeout: 1200000 });
    log(`Render finished in ${Date.now() - renderStart}ms`);

    res.download(outPath, `video-${id}.mp4`, () => {
      log(`File sent to n8n, cleaning up. Total job time: ${Date.now() - jobStart}ms`);
      fs.unlinkSync(outPath);
      fs.unlinkSync(propsPath);
      fs.rmSync(gifDir, { recursive: true });
      log('=== DONE ===');
    });
  } catch (err) {
    logError(`FAILED after ${Date.now() - jobStart}ms:`, err.message);
    if (fs.existsSync(propsPath)) fs.unlinkSync(propsPath);
    if (fs.existsSync(gifDir)) fs.rmSync(gifDir, { recursive: true });
    res.status(500).json({ error: err.message });
  }
});

const server = app.listen(3001, '0.0.0.0', () => {
  log('Render server on http://0.0.0.0:3001');
});
server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});