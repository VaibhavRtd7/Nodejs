const express = require('express');
const fs = require('fs');
const { calculate } = require('./calculate');

const app = express();
app.use(express.json());

const args = process.argv.slice(2);
if (args.length >= 3) {

    const [ operation, num1, num2 ] = args;

    const a = parseFloat(num1);
    const b = parseFloat(num2);

    const result = calculate(operation, a, b);
    console.log(`Result : ${result}`);
    console.log('Result saved to result.txt file')
}

app.get("/calc/:operations/:a/:b", (req, res) => {
    
   
    const { operation, num1, num2 } = req.params;
    console.log(req)

    const a = parseFloat(num1);
    const b = parseFloat(num2);

    const result = calculate(operation, a, b);
    console.log('Result : ', result)
    // const fileContents = fs.readFileSync('result.txt', 'utf8')

    // res.send(`<pre> ${fileContents} </pre>`)
})


const PORT = 3000;
app.listen(PORT, function (err) {
    console.log(`Server is running on the port : http://localhost:${PORT}`);
    console.log(`Try: http://localhost:${PORT}/calc/add/10/5`);
})