const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware to parse JSON body
app.use(express.json());

// Expects: { "filename": "test.txt", "content": "Hello world" }
app.post('/upload', (req, res) => {
  const { filename, content } = req.body;

  // Basic validation
  if (!filename || !content) {
    return res.status(400).json({
      error: "Request body must contain 'filename' and 'content'"
    });
  }

  // Make sure uploads folder exists
  const uploadDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const filePath = path.join(uploadDir, filename);

  fs.writeFile(filePath, content, (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return res.status(500).json({
        error: 'Failed to write file to disk'
      });
    }

    return res.status(201).json({
      message: 'File saved successfully',
      filePath: filePath
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
