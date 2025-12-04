const fs = require('fs');

const fileName = 'myTextFile.txt';

async function countWordsInFile(fileName) {
  
    try {
        
        const textFileContents = await fs.promises.readFile(fileName, 'utf8');

        const cleanedContents = textFileContents
            .replace(/[.,?!;()"\'-]/g, ' ')
            .replace(/\s+/g, ' ')
            .toLowerCase()
            .trim();
        
        const words = cleanedContents.split(' ').filter(word => word.length > 0);
        return words.length;
        
    } catch (error) {
        console.error('Error reading or processing the file : ', error);
        return -1;
    }

}

fs.writeFileSync(fileName, 'This section focuses on the  physical  aspects of data transmission, which is the very foundation of network communication. We will look into different network layouts (topologies), how  data  signals  travel across various media and the modes used for transmission.')

countWordsInFile(fileName)
.then( wordCount => {
    if(wordCount !== -1) {
        console.log(`The file ${fileName} contains ${wordCount} words.`)
    }
})
.catch( error => {
    console.error(`An unexpected error occured: ${error}`)
})

