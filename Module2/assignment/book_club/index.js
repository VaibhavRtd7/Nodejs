const express = require('express');
const fs = require('fs');
const path = require('path')
const axios = require('axios')
require('dotenv').config();

const app = express();
const PORT = 3000;

const BOOKS_URL = process.env.BOOKS_URL;

function saveJsonFile(filename, data) {

    const filepath = path.join(__dirname, 'data', filename)
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Saved ${filename} with ${data.length} books`);
}

function categorizeBooks(books) {

    const lessThan300 = [];
    const between1300_1500 = [];
    const between1500_1700 = []; 
    const between1700_1900 = [];
    const after1900 = [];

    for(const book of books) {
      
        const year = Number(book.year)
        if(!year) continue;

        if(year < 1300) lessThan300.push(book);
        else if(year >= 1300 && year < 1500) between1300_1500.push(book);
        else if(year >= 1500 && year < 1700) between1500_1700.push(book);
        else if(year >= 1700 && year < 1900) between1700_1900.push(book);
        else after1900.push(book);
    } 

    saveJsonFile("books_lessThan1300.json", lessThan300);
    saveJsonFile("books_1300_1500.json", between1300_1500);
    saveJsonFile("books_1500_1700.json", between1500_1700);
    saveJsonFile("books_1700_1900.json", between1700_1900);
    saveJsonFile("books_after1900.json", after1900);

}


app.get('/separate-books', async (req, res) => {
     
    try {
        const response = await axios(BOOKS_URL);
        const books = response.data;

        categorizeBooks(books);
        res.json({ message: "Books categorized and saved successfully in /data folder." });
    } catch (error) {
        console.error("Error:", error.message);
         res.status(500).json({ error: "Failed to process book data." });
    }

})

app.listen(PORT, () => {
    console.log(`Server running at : http://localhost:${PORT}`);
})
