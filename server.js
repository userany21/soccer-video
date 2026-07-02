const express = require('express');
const { execSync } = require('child_process');
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
    execSync(
      `npx remotion render SoccerVideo ${outPath} --props=${propsPath}`,
      { cwd: __dirname, timeout: 300000 }
    );
    res.download(outPath, `video-${id}.mp4`, () => {
      fs.unlinkSync(outPath);
      fs.unlinkSync(propsPath);
    });
  } catch (err) {
    fs.unlinkSync(propsPath);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log('Render server on :3001'));