function compileTemplate(source, variables) {
  return Object.keys(variables)
    .reduce(
      (text, name) =>
        text.replace(new RegExp(`{{${name}}}`, 'g'), variables[name] || ''),
      source,
    )
    .replace(/{{[\w_]+}}/, '');
}

module.exports = { compileTemplate };
