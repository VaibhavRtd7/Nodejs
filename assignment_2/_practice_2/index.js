const fs = require('fs').promises
const path = require('path')

// -------------------- Practice 1 --------------------
// Create one txt file name it as person.txt and write in that hello world Append hello India in person.txt.
console.log('-------- Pratice-1 --------')
// fs.writeFileSync('person.txt', 'Hello World\n')
// fs.appendFileSync('person.txt', 'Hello India \n\n')
// console.log('Write in file successfully !')

// -------------------- Practice 2  --------------------
// Accept your name from command line. And append it to person.txt as “hello “+ “name”.
console.log('\n-------- Pratice-2 --------')
// const name = process.argv[2];
// fs.appendFileSync('person.txt', `Hello, ${name}`);
// for (let i = 0; i < 3; i++) {
//     console.log(`Arg-${i}`, process.argv[i])
// }


// --------------------  Practice 3  --------------------
// Create two txt files, write some dummy text. Read two file content and print it in the console. use async and await.
console.log('\n-------- Pratice-3 --------')

//  async function readFileAndPrint() {

//     try {

//         await fs.writeFile('file1.txt', 'Contents of file-1')
//         await fs.writeFile('file2.txt', 'Contents of file-2')

//         const data = await fs.readFile('file1.txt', 'utf8');
//         console.log('Data : ', data)
//     } catch (error) {
//         console.error('Error while reading the file1 : ', error)
//     }
// }
// readFileAndPrint();


//--------------------   Practice 4  --------------------
// Write your address in one txt file and find out how many consonants are there. Remove address.txt file.
console.log('\n-------- Pratice-4 --------')

// const address = 'Neo Sense Vector Technology, Commerce House - 4, Prahaladnagar, Ahmedabad';
// fs.writeFileSync('address.txt', address, 'utf8')

// const vowels =  address.match(/[bcdfghjklmnpqrstvwxyz]/gi);
// const counts = vowels ? vowels.length : 0;
// console.log(`No of vowels in given address is ${counts}.`)


// --------------------  Practice 5  --------------------
// Create one folder files and move person.txt in that file.
console.log('\n-------- Pratice-5 --------')


async function createFolder(targetFolder) {

    try {
        await fs.mkdir(targetFolder, { recursive: true });
        console.log('Folder is created successfully !')
    } catch (error) {

        if (error.code === 'EEXIST') {
            console.log('Folder is already exists');
        } else {
            console.log('Error while creating folder');
        }
    }
}

async function moveFile(destinationFile, sourceFile) {

    try {


        // Check if the destination file already exists
        try {
            await fs.access(destinationFile);
            console.log(`File already exists at destination: ${destinationFile}`);
            return; // Stop execution if file already exists
        } catch {
            // If fs.access throws, it means file does NOT exist — safe to move
        }


        await fs.rename(sourceFile, destinationFile);
        console.log(checkIt)
        console.log(`File moved from '${sourcePath}' to '${destinationPath}' successfully.`);
    } catch (error) {
        console.error('Error while moving the file : ', error);
    }
}



const sourceFile = 'person.txt';
const targetFolder = 'myNewFolder';
const destinationFile = path.join(__dirname, targetFolder, sourceFile);

async function main() {
    await createFolder(targetFolder);
    await moveFile(destinationFile, sourceFile);
}

main();