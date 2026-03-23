import { addRecentCalculation } from './history.js';
import { state } from './state.js';

export function getRate(from, to) {
  const rates = {
    USD: { USD: 1, EUR: 0.92, GBP: 0.78 },
    EUR: { USD: 1.09, EUR: 1, GBP: 0.85 },
    GBP: { USD: 1.28, EUR: 1.18, GBP: 1 }
  };
  return rates[from]?.[to] || 1;
}

export function handleConvertInput(e) {
  if (!state.convertFrom || !state.convertTo || !state.convertFromCurrency || !state.convertToCurrency) return;
  let val = parseFloat(state.convertFrom.value.replace(/,/g, '')) || 0;
  let from = state.convertFromCurrency.value;
  let to = state.convertToCurrency.value;
  let rate = getRate(from, to);
  state.convertTo.value = (val * rate).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
  // Update rate display
  const rateDiv = document.querySelector('.convert-rate');
  if (rateDiv) rateDiv.textContent = `Rate: 1 ${from} = ${rate.toFixed(2)} ${to}`;
  // If user changed 'to' field, allow reverse conversion
  if (e && e.target === state.convertTo) {
    let valTo = parseFloat(state.convertTo.value.replace(/,/g, '')) || 0;
    let reverseRate = getRate(to, from);
    state.convertFrom.value = (valTo * reverseRate).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
  }
  // Save to recent calculations
  if (e && (e.type === 'change' || e.type === 'blur')) {
    addRecentCalculation('Unit Conversion', `${val} ${from} to ${to}`, state.convertTo.value);
  }
}