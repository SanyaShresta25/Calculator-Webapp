class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.current = '';
        this.previous = '';
        this.operator = null;
        this.waitingForInput = false;
        
        this.init();
    }
    
    init() {
        this.addEventListeners();
        this.updateDisplay('0');
    }
    
    addEventListeners() {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.dataset.number !== undefined) {
                    this.inputNumber(btn.dataset.number);
                } else if (btn.dataset.operator !== undefined) {
                    this.inputOperator(btn.dataset.operator);
                } else if (btn.dataset.action !== undefined) {
                    this.performAction(btn.dataset.action);
                }
            });
        });
        
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }
    
    inputNumber(number) {
        if (this.waitingForInput) {
            this.current = '';
            this.waitingForInput = false;
        }
        
        if (number === '.') {
            if (this.current.includes('.')) return;
            if (this.current === '') this.current = '0';
        }
        
        if (this.current === '0' && number !== '.') {
            this.current = number;
        } else {
            this.current += number;
        }
        
        this.updateDisplay(this.current);
    }
    
    inputOperator(op) {
        if (this.current === '') return;
        
        if (this.previous !== '' && this.operator && !this.waitingForInput) {
            this.calculate();
        }
        
        this.operator = op;
        this.previous = this.current;
        this.waitingForInput = true;
    }
    
    performAction(action) {
        switch (action) {
            case 'equals':
                this.calculate();
                break;
            case 'delete':
                this.delete();
                break;
            case 'reset':
                this.reset();
                break;
        }
    }
    
    calculate() {
        if (this.previous === '' || this.current === '' || !this.operator) return;
        
        const prev = parseFloat(this.previous);
        const curr = parseFloat(this.current);
        let result;
        
        switch (this.operator) {
            case '+':
                result = prev + curr;
                break;
            case '-':
                result = prev - curr;
                break;
            case '*':
                result = prev * curr;
                break;
            case '/':
                if (curr === 0) {
                    this.updateDisplay('Error');
                    this.reset();
                    return;
                }
                result = prev / curr;
                break;
        }
        
        this.current = this.formatNumber(result.toString());
        this.operator = null;
        this.previous = '';
        this.waitingForInput = true;
        this.updateDisplay(this.current);
    }
    
    delete() {
        if (this.current.length > 1) {
            this.current = this.current.slice(0, -1);
        } else {
            this.current = '0';
        }
        this.updateDisplay(this.current);
    }
    
    reset() {
        this.current = '';
        this.previous = '';
        this.operator = null;
        this.waitingForInput = false;
        this.updateDisplay('0');
    }
    
    formatNumber(num) {
        if (Math.abs(parseFloat(num)) > 999999999) {
            return parseFloat(num).toExponential(6);
        }
        return parseFloat(num).toString();
    }
    
    updateDisplay(value) {
        if (value !== 'Error' && !isNaN(value) && !value.includes('e')) {
            const parts = value.split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            value = parts.join('.');
        }
        this.display.textContent = value;
    }
    
    handleKeyboard(e) {
        if (e.key >= '0' && e.key <= '9' || e.key === '.') {
            this.inputNumber(e.key);
        } else if (['+', '-', '*'].includes(e.key)) {
            this.inputOperator(e.key);
        } else if (e.key === '/') {
            e.preventDefault();
            this.inputOperator('/');
        } else if (e.key === 'Enter' || e.key === '=') {
            this.performAction('equals');
        } else if (e.key === 'Backspace') {
            this.performAction('delete');
        } else if (e.key === 'Escape') {
            this.performAction('reset');
        }
    }
}

new Calculator();