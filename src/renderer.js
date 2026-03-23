import { state, initDOMReferences } from './state.js';
import { handlePadClick, clearAll, updateDisplay } from './calculator-ui.js';
import { handleConvertInput } from './currency.js';
import { renderRecentCalculations } from './history.js';
import { setTheme } from './theme.js';

console.log('renderer.js loaded, initializing...');

// DOM Elements (already in state, but we keep references for convenience)
let displayEl, expressionEl, themeBtns, navItems, padBtns, convertFrom, convertTo, convertFromCurrency, convertToCurrency, recentList;

function updateDOMReferences() {
  displayEl = state.displayEl;
  expressionEl = state.expressionEl;
  themeBtns = state.themeBtns;
  navItems = state.navItems;
  padBtns = state.padBtns;
  convertFrom = state.convertFrom;
  convertTo = state.convertTo;
  convertFromCurrency = state.convertFromCurrency;
  convertToCurrency = state.convertToCurrency;
  recentList = state.recentList;
}

// Additional UI handlers not moved to modules
function handleNavClick(e) {
  navItems.forEach(item => item.classList.remove('active'));
  e.currentTarget.classList.add('active');
  const mode = e.currentTarget.dataset.mode;
  state.currentMode = mode;
  document.querySelector('.calculator-panel').style.display = (mode === 'standard' || mode === 'scientific') ? '' : 'none';
  document.querySelector('.right-panel').style.display = (mode !== 'settings') ? '' : 'none';
}

function handleThemeBtn(e) {
  setTheme(e.currentTarget.dataset.theme);
}

// Keyboard support
function handleKeyboard(e) {
  if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT') return;
  if (/^[0-9]$/.test(e.key)) {
    if (state.result) {
      state.result = '';
      state.current = e.key;
      state.displayValue = state.current;
    } else {
      state.current += e.key;
      state.displayValue = state.current;
    }
    updateDisplay();
    e.preventDefault();
  } else if (e.key === '.') {
    if (!state.current.includes('.') && !state.result) {
      state.current += state.current ? '.' : '0.';
      state.displayValue = state.current;
      updateDisplay();
    }
    e.preventDefault();
  } else if (e.key === 'Backspace') {
    if (state.current) {
      state.current = state.current.slice(0, -1);
      state.displayValue = state.current || '0';
      updateDisplay();
    } else if (state.result) {
      state.result = '';
      state.displayValue = '0';
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
}

// Attach event listeners
function attachEventListeners() {
  console.log('Attaching event listeners...');
  console.log('padBtns count:', padBtns?.length || 0);
  console.log('navItems count:', navItems?.length || 0);
  
  if (padBtns) padBtns.forEach(btn => btn.addEventListener('click', handlePadClick));
  if (navItems) navItems.forEach(btn => btn.addEventListener('click', handleNavClick));
  if (themeBtns) themeBtns.forEach(btn => btn.addEventListener('click', handleThemeBtn));
  if (convertFrom) convertFrom.addEventListener('input', handleConvertInput);
  if (convertFromCurrency) convertFromCurrency.addEventListener('change', handleConvertInput);
  if (convertToCurrency) convertToCurrency.addEventListener('change', handleConvertInput);
  if (convertTo) convertTo.addEventListener('input', handleConvertInput);
  if (convertTo) convertTo.addEventListener('blur', handleConvertInput);
  window.addEventListener('keydown', handleKeyboard);
  console.log('Event listeners attached');
}

// Initialize application
function init() {
  console.log('Initializing application...');
  setTheme(state.theme);
  clearAll();
  if (convertFrom) handleConvertInput();
  renderRecentCalculations();
  console.log('Application initialized');
}

// Start when DOM is ready
function startApp() {
  console.log('Starting application...');
  // Initialize DOM references
  initDOMReferences();
  updateDOMReferences();
  attachEventListeners();
  init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
