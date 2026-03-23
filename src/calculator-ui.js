import { state } from './state.js';

console.log('calculator-ui.js loaded, window.electronAPI:', typeof window.electronAPI);

export function updateDisplay() {
  console.log('updateDisplay called, displayValue:', state.displayValue);
  if (state.displayEl) {
    state.displayEl.textContent = state.displayValue;
    console.log('Updated display element');
  }
  if (state.expressionEl) state.expressionEl.textContent = state.expression;
}

export function clearAll() {
  state.current = '';
  state.expression = '';
  state.result = '';
  state.displayValue = '0';
  updateDisplay();
}

export function handlePadClick(e) {
  const btn = e.currentTarget;
  const action = btn.dataset.action;
  const value = btn.dataset.value;
  if (action === 'clear-all') return clearAll();
  if (action === 'toggle-sign') {
    if (state.current || state.result) {
      let num = state.result || state.current;
      num = num.startsWith('-') ? num.slice(1) : '-' + num;
      if (state.result) {
        state.result = num;
        state.displayValue = num;
      } else {
        state.current = num;
        state.displayValue = num;
      }
      updateDisplay();
    }
    return;
  }
  if (action === 'percent') {
    if (state.current || state.result) {
      let num = state.result || state.current;
      num = String(parseFloat(num) / 100);
      if (state.result) {
        state.result = num;
        state.displayValue = num;
      } else {
        state.current = num;
        state.displayValue = num;
      }
      updateDisplay();
    }
    return;
  }
  if (action === 'decimal') {
    if (!state.current.includes('.') && !state.result) {
      state.current += state.current ? '.' : '0.';
      state.displayValue = state.current;
      updateDisplay();
    }
    return;
  }
  if (['add', 'subtract', 'multiply', 'divide'].includes(action)) {
    if (state.current || state.result) {
      let num = state.result || state.current;
      state.expression += (state.expression ? ' ' : '') + num + ' ' + btn.textContent.trim();
      state.current = '';
      state.result = '';
      state.displayValue = num;
      updateDisplay();
    }
    return;
  }
  if (action === 'equals') {
    if (state.current || state.expression) {
      let expr = (state.expression + (state.current ? ' ' + state.current : ''))
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/＋/g, '+')   // full-width plus
        .replace(/－/g, '-')   // full-width minus
        .replace(/,/g, '');
      console.log('Evaluating expression:', expr);
      try {
        // Use evaluateExpression from electronAPI (exposed via preload)
        if (window.electronAPI && typeof window.electronAPI.evaluateExpression === 'function') {
          const result = window.electronAPI.evaluateExpression(expr);
          console.log('Evaluation result:', result);
          state.result = String(result);
        } else {
          console.error('window.electronAPI.evaluateExpression not available');
          throw new Error('Evaluation API not available');
        }
        state.expression = '';
        state.current = '';
        state.displayValue = state.result;
      } catch (err) {
        console.error('Evaluation error:', err);
        state.result = 'Error';
        state.displayValue = 'Error';
      }
      updateDisplay();
    }
    return;
  }
  // Number input
  if (value !== undefined) {
    if (state.result) {
      state.result = '';
      state.current = value;
      state.displayValue = state.current;
    } else {
      state.current += value;
      state.displayValue = state.current;
    }
    updateDisplay();
    return;
  }
}