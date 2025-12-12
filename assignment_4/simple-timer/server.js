const express = require('express');
const path = require('path');

const app = express();
app.use(express.static(__dirname));

const PORT = 3001;


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'script.html'));
})

app.listen(PORT, () => {
    console.log(`Server is running: http://localhost:${PORT}`)
})