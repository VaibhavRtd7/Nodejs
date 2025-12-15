const express = require('express');
const fileUpload = require('express-fileupload')
const EventEmitter = require('events');
const path = require('path');
const notifier = require('node-notifier');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.static(__dirname));
app.use(fileUpload())

const eventEmitter = new EventEmitter();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.post('/upload', (req, res) => {
     
    if(!req.files || !req.files.article) {
        return res.status(400).send('No file uploaded.');
    }
    
    const article = req.files.article;   
    const uploadDir = path.join(__dirname, 'uploads');

    // create uploads folder if not exists
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }

    const filePath = path.join(uploadDir, article.name);

    // Save actual file data
    article.mv(filePath, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Failed to save file');
        }

        // Emit event AFTER saving
        eventEmitter.emit('articlePublished', article.name);
        res.status(201).send('Article uploaded & saved successfully');
    });
})

eventEmitter.on('articlePublished', (articleName) => {
    notifier.notify({
        title: 'New Article Published',
        message: `A new article named "${articleName}" has been published!`
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})