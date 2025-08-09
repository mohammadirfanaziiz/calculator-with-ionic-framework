import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage {
  expression: string = '0';
  result: string = '';
  isDarkMode: boolean = false;  

  append(value: string) {
    const lastChar = this.expression.slice(-1);
    const operators = ['+', '-', '*', '÷', '×', '/'];

    if (this.expression === '0' && !isNaN(Number(value)) && value !== '.') {
      this.expression = value;
    }
    else if (operators.includes(lastChar) && operators.includes(value)) {
      this.expression = this.expression.slice(0, -1) + value;
    }
    else {
      this.expression += value;
    }
    this.calculateInstant();
  }

  clear() {
    this.expression = '0';
    this.result = '';
  }

  backspace() {
    if (this.expression.length > 1) {
      this.expression = this.expression.slice(0, -1);
    } else {
      this.expression = '0';
    }
    this.calculateInstant();
  }

  appendPercent() {
    const lastChar = this.expression.slice(-1);
    if (!isNaN(Number(lastChar)) && !this.expression.endsWith('%')) {
      this.expression += '%';
      this.calculateInstant();
    }
  }

  private parsePercentSmart(exp: string): string {
    return exp.replace(/(\d+(\.\d+)?)([+\-*/])(\d+(\.\d+)?)%/g, (match, num1, _d1, operator, num2) => {
      const n1 = parseFloat(num1);
      const n2 = parseFloat(num2);
      let value: number;

      switch (operator) {
        case '+': value = n1 + (n1 * n2 / 100); break;
        case '-': value = n1 - (n1 * n2 / 100); break;
        case '*': value = n1 * (n2 / 100); break;
        case '/': value = n1 / (n2 / 100); break;
        default: value = n1;
      }
      return value.toString();
    });
  }

  calculateInstant() {
    try {
      let sanitized = this.expression
        .replace(/÷/g, '/')
        .replace(/×/g, '*');

      sanitized = this.parsePercentSmart(sanitized);

      if (/[\+\-\*\/]$/.test(sanitized)) {
        this.result = '';
        return;
      }

      const evalResult = eval(sanitized);
      this.result = this.formatResult(evalResult);
    } catch {
      this.result = '';
    }
  }

  calculate() {
    try {
      let sanitized = this.expression
        .replace(/÷/g, '/')
        .replace(/×/g, '*');

      sanitized = this.parsePercentSmart(sanitized);

      const evalResult = eval(sanitized);
      this.result = this.formatResult(evalResult);
      this.expression = this.result;
    } catch {
      this.result = 'Error';
    }
  }

  private formatResult(value: number): string {
    return parseFloat(value.toFixed(6)).toString();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    // Secara otomatis mengubah tema berdasarkan isDarkMode
    document.body.classList.toggle('dark', this.isDarkMode);
  }
}
