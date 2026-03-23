// Reactive state object for calculator
export const state = {
  current: '',
  expression: '',
  result: '',
  operation: null,
  currentMode: 'standard',
  theme: localStorage.getItem('calculator-theme') || 'dark',
  recentCalculations: JSON.parse(localStorage.getItem('recent-calculations') || '[]'),
  displayValue: '0',
  previous: '',
  // DOM references - will be initialized when DOM is ready
  displayEl: null,
  expressionEl: null,
  themeBtns: null,
  navItems: null,
  padBtns: null,
  convertFrom: null,
  convertTo: null,
  convertFromCurrency: null,
  convertToCurrency: null,
  recentList: null
};

// Initialize DOM references when DOM is ready
export function initDOMReferences() {
  console.log('Initializing DOM references...');
  state.displayEl = document.getElementById('display');
  state.expressionEl = document.getElementById('expression');
  state.themeBtns = document.querySelectorAll('.theme-btn');
  state.navItems = document.querySelectorAll('.nav-item');
  state.padBtns = document.querySelectorAll('.btn');
  state.convertFrom = document.getElementById('convert-from');
  state.convertTo = document.getElementById('convert-to');
  state.convertFromCurrency = document.getElementById('convert-from-currency');
  state.convertToCurrency = document.getElementById('convert-to-currency');
  state.recentList = document.querySelector('.recent-list');
  
  console.log('DOM references initialized:', {
    displayEl: !!state.displayEl,
    expressionEl: !!state.expressionEl,
    padBtns: state.padBtns?.length || 0,
    navItems: state.navItems?.length || 0
  });
}