
// Calculator logic: evaluate sanitized expressions
function sanitize(expr){
  // Allow digits, whitespace, basic operators, parentheses, decimal point, and percent sign
  if(!/^[0-9+\-*/(). %]*$/.test(expr)) return null;
  return expr.replace(/%/g, '/100');
}

function evaluateExpression(expr){
  const s = sanitize(expr);
  if(s===null) throw new Error('Invalid characters');
  // prevent accidental long-running code; use Function after validation
  try{
    // eslint-disable-next-line no-new-func
    const fn = new Function(`return (${s})`);
    const result = fn();
    if(typeof result === 'number' && !Number.isFinite(result)) throw new Error('Math error');
    return result;
  }catch(e){
    throw new Error('Invalid expression');
  }
}

// DOM Elements
const displayEl = document.getElementById('display');
const expressionEl = document.getElementById('expression');
const themeBtns = document.querySelectorAll('.theme-btn');
const navItems = document.querySelectorAll('.nav-item');
const padBtns = document.querySelectorAll('.btn');
const convertFrom = document.getElementById('convert-from');
const convertTo = document.getElementById('convert-to');
const convertFromCurrency = document.getElementById('convert-from-currency');
const convertToCurrency = document.getElementById('convert-to-currency');
const recentList = document.querySelector('.recent-list');

// Calculator state
let current = '';
let expression = '';
let operation = null;
let result = '';
let currentMode = 'standard';
let theme = localStorage.getItem('calculator-theme') || 'dark';
let recentCalculations = JSON.parse(localStorage.getItem('recent-calculations') || '[]');
let displayValue = '0';

function setTheme(newTheme) {
  theme = newTheme;
  localStorage.setItem('calculator-theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
  themeBtns.forEach(btn => btn.classList.remove('active'));
  document.querySelector(`.theme-btn.${theme}`)?.classList.add('active');
}

function updateDisplay() {
  displayEl.textContent = displayValue;
  expressionEl.textContent = expression;
}

function clearAll() {
  current = '';
  expression = '';
  result = '';
  displayValue = '0';
  updateDisplay();
}

function handlePadClick(e) {
  const btn = e.currentTarget;
  const action = btn.dataset.action;
  const value = btn.dataset.value;
  if (action === 'clear-all') return clearAll();
  if (action === 'toggle-sign') {
    if (current || result) {
      let num = result || current;
      num = num.startsWith('-') ? num.slice(1) : '-' + num;
      if (result) {
        result = num;
        displayValue = num;
      } else {
        current = num;
        displayValue = num;
      }
      updateDisplay();
    }
    return;
  }
  if (action === 'percent') {
    if (current || result) {
      let num = result || current;
      num = String(parseFloat(num) / 100);
      if (result) {
        result = num;
        displayValue = num;
      } else {
        current = num;
        displayValue = num;
      }
      updateDisplay();
    }
    return;
  }
  if (action === 'decimal') {
    if (!current.includes('.') && !result) {
      current += current ? '.' : '0.';
      displayValue = current;
      updateDisplay();
    }
    return;
  }
  if (['add', 'subtract', 'multiply', 'divide'].includes(action)) {
    if (current || result) {
      let num = result || current;
      expression += (expression ? ' ' : '') + num + ' ' + btn.textContent.trim();
      current = '';
      result = '';
      displayValue = num;
      updateDisplay();
    }
    return;
  }
  if (action === 'equals') {
    if (current || expression) {
      let expr = (expression + (current ? ' ' + current : '')).replace(/×/g, '*').replace(/÷/g, '/').replace(/,/g, '');
      try {
        result = String(evaluateExpression(expr));
        expression = '';
        current = '';
        displayValue = result;
      } catch {
        result = 'Error';
        displayValue = 'Error';
      }
      updateDisplay();
    }
    return;
  }
  // Number input
  if (value !== undefined) {
    if (result) {
      result = '';
      current = value;
      displayValue = current;
    } else {
      current += value;
      displayValue = current;
    }
    updateDisplay();
    return;
  }
}

function handleNavClick(e) {
  navItems.forEach(item => item.classList.remove('active'));
  e.currentTarget.classList.add('active');
  // Show/hide panels based on tab
  const mode = e.currentTarget.dataset.mode;
  currentMode = mode;
  document.querySelector('.calculator-panel').style.display = (mode === 'standard' || mode === 'scientific') ? '' : 'none';
  document.querySelector('.right-panel').style.display = (mode !== 'settings') ? '' : 'none';
}

function handleThemeBtn(e) {
  setTheme(e.currentTarget.dataset.theme);
}

function getRate(from, to) {
  const rates = {
    USD: { USD: 1, EUR: 0.92, GBP: 0.78 },
    EUR: { USD: 1.09, EUR: 1, GBP: 0.85 },
    GBP: { USD: 1.28, EUR: 1.18, GBP: 1 }
  };
  return rates[from]?.[to] || 1;
}

function handleConvertInput(e) {
  let val = parseFloat(convertFrom.value.replace(/,/g, '')) || 0;
  let from = convertFromCurrency.value;
  let to = convertToCurrency.value;
  let rate = getRate(from, to);
  convertTo.value = (val * rate).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
  // Update rate display
  const rateDiv = document.querySelector('.convert-rate');
  if (rateDiv) rateDiv.textContent = `Rate: 1 ${from} = ${rate.toFixed(2)} ${to}`;
  // If user changed 'to' field, allow reverse conversion
  if (e && e.target === convertTo) {
    let valTo = parseFloat(convertTo.value.replace(/,/g, '')) || 0;
    let reverseRate = getRate(to, from);
    convertFrom.value = (valTo * reverseRate).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
  }
  // Save to recent calculations
  if (e && (e.type === 'change' || e.type === 'blur')) {
    addRecentCalculation('Unit Conversion', `${val} ${from} to ${to}`, convertTo.value);
  }
}

function addRecentCalculation(type, exp, result) {
  recentCalculations.unshift({ type, exp, result });
  if (recentCalculations.length > 10) recentCalculations.pop();
  localStorage.setItem('recent-calculations', JSON.stringify(recentCalculations));
  renderRecentCalculations();
}

function renderRecentCalculations() {
  if (!recentList) return;
  recentList.innerHTML = '';
  for (const item of recentCalculations) {
    const div = document.createElement('div');
    div.className = 'recent-item';
    div.innerHTML = `${item.type} <span class="recent-exp">${item.exp}</span> <span class="recent-result">${item.result}</span>`;
    recentList.appendChild(div);
  }
}

// Attach events
padBtns.forEach(btn => btn.addEventListener('click', handlePadClick));
navItems.forEach(btn => btn.addEventListener('click', handleNavClick));
themeBtns.forEach(btn => btn.addEventListener('click', handleThemeBtn));
convertFrom.addEventListener('input', handleConvertInput);
convertFromCurrency.addEventListener('change', handleConvertInput);
convertToCurrency.addEventListener('change', handleConvertInput);
convertTo.addEventListener('input', handleConvertInput);
convertTo.addEventListener('blur', handleConvertInput);

// Keyboard support
window.addEventListener('keydown', (e) => {
  if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT') return;
  if (/^[0-9]$/.test(e.key)) {
    if (result) {
      result = '';
      current = e.key;
      displayValue = current;
    } else {
      current += e.key;
      displayValue = current;
    }
    updateDisplay();
    e.preventDefault();
  } else if (e.key === '.') {
    if (!current.includes('.') && !result) {
      current += current ? '.' : '0.';
      displayValue = current;
      updateDisplay();
    }
    e.preventDefault();
  } else if (e.key === 'Backspace') {
    if (current) {
      current = current.slice(0, -1);
      displayValue = current || '0';
      updateDisplay();
    } else if (result) {
      result = '';
      displayValue = '0';
      updateDisplay();
    }
    e.preventDefault();
  } else if (e.key === '+' || e.key === '-') {
    let op = e.key === '+' ? 'add' : 'subtract';
    document.querySelector(`.btn[data-action="${op}"]`).click();
    e.preventDefault();
  } else if (e.key === '*' || e.key === 'x' || e.key === 'X') {
    document.querySelector('.btn[data-action="multiply"]').click();
    e.preventDefault();
  } else if (e.key === '/' || e.key === '÷') {
    document.querySelector('.btn[data-action="divide"]').click();
    e.preventDefault();
  } else if (e.key === 'Enter' || e.key === '=') {
    document.querySelector('.btn.equals').click();
    e.preventDefault();
  } else if (e.key === 'Escape') {
    clearAll();
    e.preventDefault();
  }
});

// Init
setTheme(theme);
clearAll();
handleConvertInput();
renderRecentCalculations();
function attachButtonHandlers() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = btn.dataset.action;
      const value = btn.dataset.value;
      onButtonClick(action, value);
    });
  });

  document.querySelectorAll('.mem-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      onMemoryButtonClick(action);
    });
  });
}

function onMemoryButtonClick(action) {
  if (action === 'memory-clear') memoryClear();
  else if (action === 'memory-recall') memoryRecall();
  else if (action === 'memory-add') memoryAdd();
  else if (action === 'memory-subtract') memorySubtract();
  else if (action === 'memory-store') memoryStore();
}

function onButtonClick(action, value) {
  if (action === 'clear-all') {
    current = '';
    previous = '';
    operation = null;
    setDisplay('0');
    return;
  }

  if (action === 'clear') {
    current = '';
    setDisplay('0');
    return;
  }

  if (action === 'backspace') {
    current = current.slice(0, -1);
    setDisplay(current || '0');
    return;
  }

  if (action === 'decimal') {
    if (!current.includes('.')) {
      current += '.';
    }
    setDisplay(current || '0');
    return;
  }

  if (action === 'toggle-sign') {
    if (current) {
      if (current.startsWith('-')) {
        current = current.slice(1);
      } else {
        current = '-' + current;
      }
      setDisplay(current);
    }
    return;
  }

  if (action === 'percent') {
    if (current) {
      const val = parseFloat(current);
      current = String(val / 100);
      setDisplay(current);
    }
    return;
  }

  if (action === 'reciprocal') {
    if (current) {
      const val = parseFloat(current);
      if (val !== 0) {
        current = String(1 / val);
        setDisplay(current);
      }
    }
    return;
  }

  if (action === 'square') {
    if (current) {
      const val = parseFloat(current);
      current = String(val * val);
      setDisplay(current);
    }
    return;
  }

  if (action === 'sqrt') {
    if (current) {
      const val = parseFloat(current);
      if (val >= 0) {
        current = String(Math.sqrt(val));
        setDisplay(current);
      }
    }
    return;
  }

  // Operation buttons
  if (action === 'add' || action === 'subtract' || action === 'multiply' || action === 'divide') {
    if (current) {
      if (previous && operation) {
        try {
          const result = performOperation(parseFloat(previous), parseFloat(current), operation);
          current = String(result);
          previous = String(result);
        } catch (e) {
          setDisplay('Error');
          current = '';
          previous = '';
          operation = null;
          return;
        }
      } else {
        previous = current;
      }
      
      operation = action;
      current = '';
    }
    return;
  }

  if (action === 'equals') {
    if (current && previous && operation) {
      try {
        const result = performOperation(parseFloat(previous), parseFloat(current), operation);
        setDisplay(String(result));
        current = String(result);
        previous = '';
        operation = null;
      } catch (e) {
        setDisplay('Error');
      }
    }
    return;
  }

  // Number input
  if (value !== undefined) {
    current += value;
    setDisplay(current);
    return;
  }
}

function performOperation(prev, curr, op) {
  switch (op) {
    case 'add':
      return prev + curr;
    case 'subtract':
      return prev - curr;
    case 'multiply':
      return prev * curr;
    case 'divide':
      if (curr === 0) throw new Error('Division by zero');
      return prev / curr;
    default:
      return curr;
  }
}

// Navigation
function attachNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const mode = item.dataset.mode;
      switchMode(mode, item);
    });
  });
}

function switchMode(mode, navItem) {
  // Update active nav item
  document.querySelectorAll('.nav-item.active').forEach(item => {
    item.classList.remove('active');
  });
  navItem.classList.add('active');

  // Update title
  const modeNames = {
    standard: 'Standard',
    scientific: 'Scientific',
    graphing: 'Graphing',
    programmer: 'Programmer',
    date: 'Date calculation',
    currency: 'Currency',
    volume: 'Volume',
    length: 'Length',
    weight: 'Weight and mass',
    temperature: 'Temperature',
    settings: 'Settings'
  };

  modeTitle.textContent = modeNames[mode] || mode;
  currentMode = mode;

  // Show appropriate view
  if (mode === 'standard' || mode === 'scientific') {
    standardView.style.display = '';
    otherView.style.display = 'none';
  } else {
    standardView.style.display = 'none';
    otherView.style.display = 'flex';
  }
}

// Tab functionality
function attachTabHandlers() {
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
}

// Keyboard support
window.addEventListener('keydown', (e) => {
  if (!['standard', 'scientific'].includes(currentMode)) return;

  const key = e.key;

  // Number keys
  if (/^[0-9]$/.test(key)) {
    e.preventDefault();
    onButtonClick(null, key);
    return;
  }

  // Operators
  if (key === '+') {
    e.preventDefault();
    onButtonClick('add');
  } else if (key === '-') {
    e.preventDefault();
    onButtonClick('subtract');
  } else if (key === '*') {
    e.preventDefault();
    onButtonClick('multiply');
  } else if (key === '/') {
    e.preventDefault();
    onButtonClick('divide');
  } else if (key === '.' || key === ',') {
    e.preventDefault();
    onButtonClick('decimal');
  } else if (key === 'Enter' || key === '=') {
    e.preventDefault();
    onButtonClick('equals');
  } else if (key === 'Backspace' || key === 'Delete') {
    e.preventDefault();
    onButtonClick('backspace');
  } else if (key === 'Escape') {
    e.preventDefault();
    onButtonClick('clear-all');
  } else if (key.toLowerCase() === 'c') {
    e.preventDefault();
    onButtonClick('clear');
  } else if (key === '%') {
    e.preventDefault();
    onButtonClick('percent');
  }
});

// Keep track of which mode buttons are available
const modeButtons = {
  'standard': ['.btn'],
  'scientific': ['.btn', '.sci-btn']
};

// Initialize on load
init();


