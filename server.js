const express = require('express');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const app = express();
app.use(express.json({ limit: '10mb' }));

// Serve temp GIF files statically
app.use('/tmp-gifs', express.static(path.join(__dirname, 'tmp-gifs')));

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
  });
}

app.post('/render', async (req, res) => {
  const data = req.body;
  const id = Date.now();
  const propsPath = path.join(__dirname, `props-${id}.json`);
  const outPath = path.join(__dirname, `out/video-${id}.mp4`);
  const gifDir = path.join(__dirname, 'tmp-gifs', `${id}`);

  fs.mkdirSync(path.join(__dirname, 'out'), { recursive: true });
  fs.mkdirSync(gifDir, { recursive: true });

  try {
    // Pre-download GIFs and serve locally
    const gifKeys = ['gifHook', 'gifMatch', 'gifBet', 'gifPayout', 'gifCta'];
    for (const key of gifKeys) {
      if (data[key]) {
        const filename = `${key}.mp4`;
        const localPath = path.join(gifDir, filename);
        await downloadFile(data[key], localPath);
        data[key] = `http://localhost:3001/tmp-gifs/${id}/${filename}`;
      }
    }

    fs.writeFileSync(propsPath, JSON.stringify(data));

    execFileSync('npx', [
      'remotion', 'render',
      'src/index.ts',
      'SoccerVideo',
      outPath,
      `--props=${propsPath}`,
      '--concurrency=1',
      '--timeout=30000',
    ], { cwd: __dirname, timeout: 600000, stdio: 'pipe' });

    res.download(outPath, `video-${id}.mp4`, () => {
      fs.unlinkSync(outPath);
      fs.unlinkSync(propsPath);
      fs.rmSync(gifDir, { recursive: true });
    });
  } catch (err) {
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