const { addition, subtraction, multiplication, division } = require('./mathOperations.js')
const fs = require('fs');

function calculate(operation, num1, num2) {

    let result;

    switch (operation) {

        case "add":
            result = addition(num1, num2);
            break;

        case "sub":
            result = subtraction(num1, num2);
            break;

        case "mul":
            result = multiplication(num1, num2);
            break;

        case "div":
            result = division(num1, num2);
            break;
        
        default:
            result = "Invalid Operations";
    }
    
    const output = `Operation: ${operation}\nNumbers: ${a}, ${b}\nResult: ${result}`;
    fs.writeFileSync('result.txt', output);

    return result;
}

module.exports = { calculate }