const t = require('@babel/types');

function addComment(node, text) {
  const lines = text.split('\n').map((line) => line.trim());
  lines[0] = ` ${lines[0]}`;
  lines[lines.length - 1] = `${lines[lines.length - 1]} `;
  t.addComment(
    node,
    'leading',
    lines
      .map((line, index) =>
        index > 0 && index < lines.length ? ` * ${line}` : line,
      )
      .join('\n'),
  );
}

module.exports = { addComment };
