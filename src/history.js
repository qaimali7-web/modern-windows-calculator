import { state } from './state.js';

export function addRecentCalculation(type, exp, result) {
  state.recentCalculations.unshift({ type, exp, result });
  if (state.recentCalculations.length > 10) state.recentCalculations.pop();
  localStorage.setItem('recent-calculations', JSON.stringify(state.recentCalculations));
  renderRecentCalculations();
}

export function renderRecentCalculations() {
  if (!state.recentList) return;
  state.recentList.innerHTML = '';
  for (const item of state.recentCalculations) {
    const div = document.createElement('div');
    div.className = 'recent-item';
    div.innerHTML = `${item.type} <span class="recent-exp">${item.exp}</span> <span class="recent-result">${item.result}</span>`;
    state.recentList.appendChild(div);
  }
}