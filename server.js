const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static files (images, etc.)
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Load portfolio data from JSON
const dataPath = path.join(__dirname, 'data', 'portfolio.json');
function getData() {
  return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
}

app.get('/api/about', (req, res) => {
  const data = getData();
  res.json(data.about);
});

app.get('/api/skills', (req, res) => {
  const data = getData();
  res.json(data.skills);
});

app.get('/api/projects', (req, res) => {
  const data = getData();
  res.json(data.projects);
});

app.get('/api/experience', (req, res) => {
  const data = getData();
  res.json(data.experience);
});

app.get('/api/certifications', (req, res) => {
  const data = getData();
  res.json(data.certifications);
});

app.get('/api/hackathons', (req, res) => {
  const data = getData();
  res.json(data.hackathons);
});

// (Optional) Contact form endpoint
app.post('/api/contact', (req, res) => {
  // Here you would handle sending email or storing contact requests
  res.json({ success: true, message: 'Message received!' });
});

app.listen(PORT, () => {
  console.log(`Portfolio backend running on http://localhost:${PORT}`);
});
