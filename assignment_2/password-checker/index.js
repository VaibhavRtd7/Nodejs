const data = require('./data')
const fs = require('fs')

function isCorrectpassword() {

    const argv = process.argv.slice(2);
    const username = argv[0];
    const password = argv[1]; 
    
    let key = false;
    for (let item of data) {

        if(item.name == username && item.password == password) {
            console.log('Authorized user !!!');
            key = true;
            break;
        } 
    }
    
    if(!key) {
        console.log('Alert - Unauthorize user !!!')
    }
    
}

function addEmailtoUsers() {

    for(let user of data) {
        let email = user.name.toLowerCase() + '@gmail.com';
        user.email = email;
    }
    
    const fileContents = JSON.stringify(data, null, 2);
    fs.writeFileSync('data.js', `const data = ${fileContents}\n\nmodule.exports = data;`)
    console.log('File updated successfully !!')

}

addEmailtoUsers();
// isCorrectpassword();



// const readline = require('readline');

// const r1 = readline.createInterface({
//     input : process.stdin,
//     output : process.stdout
// })

// r1.question('Enter your name : ', (name) => {
//     console.log(`Hello, ${name} !!`);
// })