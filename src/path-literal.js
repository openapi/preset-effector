const expression = /\{(\w+)\}/g;

/**
 * Convert string with path parameters to string literal object
 * @param {string} string
 */
function stringPathToLiteral(string) {
  const matches = Array.from(string.matchAll(expression));
  if (matches.length === 0) return null;

  const expressions = [];
  const quasis = [];

  let latestIndex = 0;
  for (const { 0: expression, 1: name, index } of matches) {
    quasis.push(string.slice(latestIndex, index));
    expressions.push(name);
    latestIndex = index + expression.length;
  }

  quasis.push(string.slice(latestIndex));

  return {
    expressions,
    quasis,
  };
}

module.exports = { stringPathToLiteral };
