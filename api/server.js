const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const path = require('path');

const app = express();

// ✅ Explicit CORS setup
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());

// ✅ Test route
app.get('/ping', (req, res) => {
  res.send('pong');
});

process.on('uncaughtException', err => {
    console.error('💥 Uncaught Exception:', err);
  });
  process.on('unhandledRejection', err => {
    console.error('💥 Unhandled Rejection:', err);
  });

  
// ✅ Main NER route
app.post('/annotate', (req, res) => {
  const text = req.body.text;
  console.log('📥 Received text:', text);

  const pythonPath = path.resolve(__dirname, '../ner_pipeline/annotate.py');
  const python = spawn(
    path.resolve(__dirname, '../.venv/bin/python'),
    [pythonPath]
  );  
  
  let data = '';
  python.stdout.on('data', chunk => {
    console.log('🐍 Python output:', chunk.toString());
    data += chunk;
  });

  python.stderr.on('data', err => {
    console.error('❌ Python error:', err.toString());
  });

  python.on('close', code => {
    console.log('🔚 Python exited with code:', code);
    try {
      const parsed = JSON.parse(data);
      res.json(parsed);
    } catch (e) {
      console.error('⚠️ Failed to parse Python output:', data);
      res.status(500).json({ error: 'Failed to parse Python output' });
    }
  });

  python.stdin.write(text);
  python.stdin.end();
});

// ✅ Keep server alive
app.listen(5050, () => {
  console.log('🚀 NER API running on port 5050');
});

setInterval(() => {
    console.log('⏳ Server is still alive...');
  }, 5050);
  