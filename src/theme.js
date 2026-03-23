import { state } from './state.js';

export function setTheme(newTheme) {
  state.theme = newTheme;
  localStorage.setItem('calculator-theme', state.theme);
  document.documentElement.setAttribute('data-theme', state.theme);
  if (state.themeBtns) {
    state.themeBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.theme-btn.${state.theme}`)?.classList.add('active');
  }
}