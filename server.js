const express = require('express');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json({ limit: '10mb' }));

app.post('/render', async (req, res) => {
  const data = req.body;
  const id = Date.now();
  const propsPath = path.join(__dirname, `props-${id}.json`);
  const outPath = path.join(__dirname, `out/video-${id}.mp4`);

  fs.mkdirSync(path.join(__dirname, 'out'), { recursive: true });
  fs.writeFileSync(propsPath, JSON.stringify(data));

  try {
    execFileSync('npx', [
      'remotion', 'render',
      'src/index.ts',
      'SoccerVideo',
      outPath,
      `--props=${propsPath}`,
      '--concurrency=1',
    ], { cwd: __dirname, timeout: 300000, stdio: 'pipe' });

    res.download(outPath, `video-${id}.mp4`, () => {
      fs.unlinkSync(outPath);
      fs.unlinkSync(propsPath);
    });
  } catch (err) {
    if (fs.existsSync(propsPath)) fs.unlinkSync(propsPath);
    res.status(500).json({ error: err.message });
  }
});

const server = app.listen(3001, '127.0.0.1', () => {
  console.log('Render server on http://127.0.0.1:3001');
});
server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});