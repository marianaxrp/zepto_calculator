const calculator = {
    displayValue: '0',              // possui um valor em string que representa o input do usuário ou o resultado de uma operação
    firstOperand: null,             // armazena o primeiro operador de uma expressão
    waitingForSecondOperand: null,  // checa se firstOperand e operator receberam inputs, se for true o próximo número adicionado pelo usuário será o segundo operando
    operator: null,                 // armazena o operador para uma expressão
    currentExpression: null,
}

function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;
    
    if (waitingForSecondOperand === true) { // checa se waitingForSecondOperand está setada para true
        calculator.displayValue = digit;    // se sim, displayValue é sobrescrita com o dígito clicado
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit; // se o valor atual de displayValue for '0', ele é sobrescrito. se não for, concatena o valor inputado com o valor atual no display
    }
    
    //// VERIFICAR:    
    // calculator.currentExpression = calculator.displayValue;
    console.log(calculator);
}

function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand === true) { // se um ponto decimal é adicionado, checa se waitingForSecondOperand está setada para true 
        calculator.displayValue = '0.';                // displayValue é substituída para '0.'
        calculator.waitingForSecondOperand = false;    // e waitingForSecondOperand é setada para false, para que os próximos dígitos sejam concatenados como o segundo operando
        return;
    }

    if (!calculator.displayValue.includes(dot)) { // checa se a propriedade displayValue não contém um ponto decialm
        calculator.displayValue += dot;           // se for true, adiciona um ponto decimal
    }
}

function handleOperator(nextOperand) {
    const { firstOperand, displayValue, operator } = calculator; // desestrutura as propriedades no objeto calculadora
    const inputValue = parseFloat(displayValue);                 // parseFloat converte o conteúdo string de displayValue para um número com vírgula flutuante 

    if (operator && calculator.waitingForSecondOperand) { // checa se já existe um operator e se waitingForSecondOperand é true
        calculator.operator = nextOperand;                // se sim, o valor de operator é substituído com o novo operador e sai da função
        console.log(calculator);
        return;
    }

    if (firstOperand === null && !isNaN(inputValue)) { // verifica se firstOperand é nulo e inputValue não é um valor NaN
        calculator.firstOperand = inputValue;          // se for true, armazena o valor de inputValue na propriedade firstOperand
    } else if (operator) {                             // checka se a propriedade operator possui um operador
        const result = calculate(firstOperand, inputValue, operator); // se sim, invoca a função calculate e o resultado é armazenado na variável result

        calculator.displayValue = `${parseFloat(result.toFixed(7))}`; // toFixed(7) restringe para 7 o número de dígitos depois do ponto e parseFloat converte o número para não ter os zeros ao final
        calculator.firstOperand = result;                             // o valor de firstOperand é atualizado para ser utilizado no próximo cálculo 
    }

    calculator.waitingForSecondOperand = true; // indica que o primeiro operando foi adicionado
    calculator.operator = nextOperand;        // qualquer dígito inputado pelo usuário agora será o segundo operando
    console.log(calculator);

    
    ///// VERIFICAR:    
    // calculator.currentExpression = firstOperand + operator + nextOperand;
    console.log('current', calculator.currentExpression);
}

function calculate(firstOperand, secondOperand, operator) { // recebe os três argumentos e checa o valor do operator para determinar qual operação fazer
    
    if (operator === '+') {
        return firstOperand + secondOperand;
    } else if (operator === '-') {
        return firstOperand - secondOperand;
    } else if (operator === '*') {
        return firstOperand * secondOperand;
    } else if (operator === '/') {
        return firstOperand / secondOperand;
    }

    return secondOperand;
}

function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = null;
    calculator.operator = null;
    console.log(calculator);
}

function updateDisplay() {
    const display = document.querySelector('.display'); // seleciona o elemento com a classe 'display'
    display.value = calculator.displayValue;            // atualiza o value do elemento com o conteúdo de displayValue
    
    console.log(calculator.operator)
}

// function updateCurrentExpressionDisplay() {
//     const currentExpressionDisplay = document.querySelector('.currentExpressionDisplay');
//     currentExpressionDisplay.value = calculator.currentExpression;
// }

updateDisplay();
// updateCurrentExpressionDisplay();

const keys = document.querySelector('.keys'); // seleciona o elemento com a classe 'keys'
keys.addEventListener('click', (e) => {       // escuta os eventos de click, como todos as teclas na calculadora são filhos deste elemento, o evento de click filtra eles também (event delegation)
    const { target } = e;                     // acessa o elemento clicado // destructuring assignment
    const { value } = target;                 // acessa o valor do elemento clicado

    if (!target.matches('button')) { // checa se o elemento clicado é um botão 
        return;                      // se não for, sai da função
    }

    switch(value) {
        case '+':
        case '-':
        case '*':
        case '/':
        case '=':
            handleOperator(value);
            break;
        case '.':
            inputDecimal(value);
            break;
        case 'allClear':
            resetCalculator();
            break;
        default: 
            if (Number.isInteger(parseFloat(value))) { // checa se a tecla é um integer
                inputDigit(value);
            }
    }
    updateDisplay();
    // updateCurrentExpressionDisplay();
});