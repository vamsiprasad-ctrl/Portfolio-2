const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());

// Helper to read/write data
function readData() {
  if (!fs.existsSync(DATA_FILE)) return {};
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Get all section content
app.get('/api/sections/:sectionId', (req, res) => {
  const data = readData();
  const sectionId = req.params.sectionId;
  res.json({ content: data[sectionId] || '' });
});

// Save/replace section content
app.post('/api/sections/:sectionId', (req, res) => {
  const data = readData();
  const sectionId = req.params.sectionId;
  data[sectionId] = req.body.content;
  writeData(data);
  res.json({ success: true });
});

// Delete section content
app.delete('/api/sections/:sectionId', (req, res) => {
  const data = readData();
  const sectionId = req.params.sectionId;
  delete data[sectionId];
  writeData(data);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
