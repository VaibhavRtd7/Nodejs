const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
const PORT = 3001;

app.get('/', (req, res) => {
    res.json({ message: 'this is empty path' })
})

app.get('/persons', (req, res) => {

    const filePath = path.join(__dirname, 'person.json');
    fs.readFile(filePath, (err, data) => {

        if (err) {
            console.log(filePath)
            return res.status(500).json({ message: "Error reading file", error: err })
        }

        try {

            const d = JSON.parse(data);
            res.json(d);

        } catch (parseError) {
            res.status(500).json({ message: "Error parsing JSON", error: parseError });
        }

    })
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/persons`);
});