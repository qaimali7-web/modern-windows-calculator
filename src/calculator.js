// Calculator logic: evaluate sanitized expressions

const { evaluate } = require('mathjs');

function evaluateExpression(expr) {
  try {
    // Normalize operators that may come from button text content
    const normalized = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')   // HTML minus character (not ASCII hyphen)
      .replace(/,/g, '');   // remove thousands separators

    const result = evaluate(normalized);
    if (typeof result !== 'number' || !Number.isFinite(result)) {
      throw new Error('Math error');
    }
    return result;
  } catch (e) {
    throw new Error('Invalid expression');
  }
}

module.exports = { evaluateExpression };