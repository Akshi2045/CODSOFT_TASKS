class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement, historyListElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.historyListElement = historyListElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') {
            this.currentOperand = '0';
        }
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                computation = prev === 0 ? 'Error' : prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }

        const calculationString = `${prev} ${this.operation} ${current}`;
        this.addHistory(calculationString, computation);

        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
    }

    addHistory(expression, result) {
        const emptyMsg = this.historyListElement.querySelector('.empty-history');
        if (emptyMsg) emptyMsg.remove();

        const li = document.createElement('li');
        li.className = 'history-item';
        li.innerHTML = `
            <span class="history-expr">${expression} =</span>
            <span class="history-res">${result}</span>
        `;
        this.historyListElement.prepend(li);
    }

    clearHistory() {
        this.historyListElement.innerHTML = '<li class="empty-history">No calculations yet</li>';
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.currentOperand;
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = `${this.previousOperand} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

// DOM Elements
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operator]');
const equalsButton = document.querySelector('[data-action="calculate"]');
const deleteButton = document.querySelector('[data-action="delete"]');
const clearButton = document.querySelector('[data-action="clear"]');
const previousOperandTextElement = document.getElementById('previous-operand');
const currentOperandTextElement = document.getElementById('current-operand');
const historyListElement = document.getElementById('history-list');
const clearHistoryButton = document.getElementById('clear-history');
const themeToggleBtn = document.getElementById('theme-toggle');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement, historyListElement);

// Event Listeners
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.dataset.number);
        calculator.updateDisplay();
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.dataset.operator);
        calculator.updateDisplay();
    });
});

equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

clearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

clearHistoryButton.addEventListener('click', () => {
    calculator.clearHistory();
});

// Theme Switcher Feature
themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('gold-theme');
});
