
function addition(a, b) {
    return a + b;
}

function multiplication(a, b) {
    return a * b;
}

function subtraction(a, b) {
    return a - b;
}

function division(a, b) {

    if(b == 0) return 'Error : Division by zero !!';
    return a / b;
}

module.exports = { addition, multiplication, subtraction, division };