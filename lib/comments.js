function renderComments(comment) {
  return comment
    .split('\n')
    .filter(Boolean)
    .map((line) => `// ${line.trim()}`);
}

module.exports = { renderComments };
