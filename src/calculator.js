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

module.exports = { evaluateExpression };
