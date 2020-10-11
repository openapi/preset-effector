function addIndentation(indent) {
  return (line) => ' '.repeat(indent) + line;
}

module.exports = { addIndentation };
