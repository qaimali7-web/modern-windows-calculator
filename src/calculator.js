// Calculator logic: evaluate sanitized expressions

const { evaluate } = require('mathjs');

function evaluateExpression(expr) {
  try {
    const result = evaluate(expr);
    if (!Number.isFinite(result)) throw new Error('Math error');
    return result;
  } catch (e) {
    throw new Error('Invalid expression');
  }
}

module.exports = { evaluateExpression };