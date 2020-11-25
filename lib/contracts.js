const { renderComments } = require('./comments');

function renderSchema(schema) {
  switch (schema.type) {
    case 'object':
      return renderObject(schema);
    case 'array':
      return renderArray(schema);
    case 'string':
      return renderString(schema);
    case 'number':
    case 'integer':
      return [`typed.number`];
    case 'boolean':
      return [`typed.boolean`];
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
      lines.push(...renderComments(content.description));
    }
    lines.push(...renderProperty({ name, isRequired, typeLines }));
  }

  return [`typed.object({`, ...lines, `})`];
}

function renderString(schema) {
  if (schema.enum) {
    const variants = schema.enum.filter(Boolean).map((v) => `'${v}'`);
    return variants.length > 3
      ? [`typed.union(`, ...variants.map((v) => v + `,`), ')']
      : [`typed.union(${variants.join(', ')})`];
  }
  return [`typed.string`];
}

module.exports = { renderSchema };

function required(schema, name) {
  if (schema.required) {
    return schema.required.includes(name);
  }
  return false;
}

function renderProperty({ name, isRequired, typeLines }) {
  const modifier = isRequired ? '' : '.optional';

  if (typeLines.length === 1) {
    return [`${name}: ${typeLines[0]}${modifier},`];
  }

  const first = `${name}: ${typeLines[0]}`;
  const middle = typeLines.slice(1, -1);
  const last = `${typeLines[typeLines.length - 1]}${modifier},`;
  return [first, ...middle, last];
}

function renderArray(schema) {
  const itemType = renderSchema(schema.items);
  if (itemType.length > 1) {
    return [`typed.array(`, ...itemType, `)`];
  }
  return [`typed.array(${itemType[0]})`];
}
