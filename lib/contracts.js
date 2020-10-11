function renderSchema(schema) {
  switch (schema.type) {
    case 'object':
      return renderObject(schema);
    case 'string':
      return renderString(schema);
    default:
      return ['custom.any'];
  }
}

function renderObject(schema) {
  if (schema.properties) {
    return renderShape(schema);
  }
  return [`typed.objectOf(custom.any)`];
}

function renderShape(schema) {
  const lines = [];

  for (const name in schema.properties) {
    const content = schema.properties[name];
    const isRequired = required(schema, name);
    const typeLines = renderSchema(content);

    if (content.description) {
      lines.push(...renderDescriptionComments(content.description));
    }
    lines.push(...renderProperty({ name, isRequired, typeLines }));
  }

  return [`typed.object({`, ...lines.map(addIndentation(2)), `})`];
}

function renderString(schema) {
  if (schema.enum) {
    const variants = schema.enum.map((variant) => `'${variant}',`);
    return variants.length > 3
      ? [`type.union(`, ...variants.map(addIndentation(2)), ')']
      : [`type.union(${variants.filter(Boolean).join(', ')})`];
  }
  return [`type.string`];
}

module.exports = { renderSchema };

function required(schema, name) {
  if (schema.required) {
    return schema.required.includes(name);
  }
  return false;
}

function renderDescriptionComments(description) {
  return description
    .split('\n')
    .filter(Boolean)
    .map((line) => `// ${line.trim()}`);
}

function addIndentation(indent) {
  return (line) => ' '.repeat(indent) + line;
}

function renderProperty({ name, isRequired, typeLines }) {
  const modifier = isRequired ? '' : '.maybe';

  if (typeLines.length === 1) {
    return [`${name}: ${typeLines[0]}${modifier},`];
  }

  const first = `${name}: ${typeLines[0]}`;
  const middle = typeLines.slice(1, -1).map(addIndentation(2));
  const last = `${typeLines[typeLines.length - 1]}${modifier},`;
  return [first, ...middle, last];
}
