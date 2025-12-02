const express = require('express');
const fs = require('fs');
const { calculate } = require('./calculate');
const { ADDRCONFIG } = require('dns');

const app = express();
app.use(express.json());

const args = process.argv.slice(2);
const [ operation, num1, num2 ] = args;
console.log('args : ', args)
if (args.length >= 3) {

    const a = parseFloat(num1);
    const b = parseFloat(num2);

    const result = calculate(operation, a, b);
    console.log(`Result : ${result}`);
    console.log('Result saved to result.txt file')
}

app.get('/', (req, res) => {
    res.send(`<pre> HOME PAGE </pre>`)
})

app.get("/calc/:operation/:num1/:num2", (req, res) => {
    
    const { operation, num1, num2 } = req.params;
    console.log("Params : ", req.params)

    const a = parseFloat(num1);
    const b = parseFloat(num2);

    const result = calculate(operation, a, b);
    console.log('Result : ', result)
    const fileContents = fs.readFileSync('result.txt', 'utf8')

    res.send(`<pre>${fileContents} </pre>`)
})


const PORT = 3000;
app.listen(PORT, function (err) {
    console.log(`Server is running on the port : http://localhost:${PORT}`);
    console.log(`Try: http://localhost:${PORT}/calc/${operation}/${num1}/${num2}`);
})