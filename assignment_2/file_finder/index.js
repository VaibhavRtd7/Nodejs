const fs = require('fs');
const path = require('path');

function createTempFiles() {

    fs.writeFileSync('./demo_folder/file1.txt', 'Contents of file 1')
    fs.writeFileSync('./demo_folder/file2.txt', 'Contents of file 2')
    fs.writeFileSync('./demo_folder/code.cpp', 'Contents of file 3')

    console.log('Files created successfully.')
} 

function readFiles() {
    
    const folder_name = './demo_folder';
    fs.readdir(folder_name, (err, files) => {
          
        if(err) {
            console.log("Error while reading the files.");
            return;
        } 
        
        console.log("Below are the file names in demo_folder :");
        files.forEach(file => {
            console.log(file+ " ");
        })
         
    });

}

createTempFiles();
setTimeout(() => {
    readFiles()
}, 0)