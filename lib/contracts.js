const { renderComments } = require('./comments');
const { addIndentation } = require('./indentation');

class Node {
  static from(value) {
    return new Node(value);
  }

  constructor(value) {
    this.value = value;
  }

  isMultiline() {
    return false;
  }

  toString() {
    return this.value;
  }

  count() {
    return this.value ? 1 : 0;
  }
}

class LiteralString extends Node {
  isMultiline() {
    return this.value.includes('\n');
  }

  toString() {
    return `'${this.value}'`;
  }
}

class List extends Node {
  isMultiline() {
    return this.value.some((item) => item.isMultiline()) || this.count() > 3;
  }

  toString() {
    return this.isMultiline()
      ? '\n' + this.values.map((variant) => variant.toString() + ',\n').join('')
      : this.values.map((variant) => variant.toString()).join(', ');
  }
}

class Union extends List {
  toString() {
    return `typed.union(${super.toString()})`;
  }
}

function renderSchema(schema) {
  if (schema.oneOf) {
    return Union.of(schema.oneOf);
  }

  switch (schema.type) {
    case 'object':
      return renderObject(schema);
    case 'array':
      return renderArray(schema);
    case 'string':
      return renderString(schema);
    case 'number':
    case 'integer':
      return Node.from(`typed.number`);
    case 'boolean':
      return Node.from(`typed.boolean`);
    default:
      return Node.from('custom.any');
  }
}

function renderObject(schema) {
  if (schema.properties) {
    return renderShape(schema);
  }
  return Node.from(`typed.objectOf(custom.any)`);
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

  return [`typed.object({`, ...lines.map(addIndentation(2)), `})`];
}

function renderString(schema) {
  if (schema.enum) {
    return renderUnion(schema.enum.filter(Boolean), (v) => `'${v}'`);
  }
  return Node.from(`typed.string`);
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
  const middle = typeLines.slice(1, -1).map(addIndentation(2));
  const last = `${typeLines[typeLines.length - 1]}${modifier},`;
  return [first, ...middle, last];
}

function renderArray(schema) {
  const itemType = renderSchema(schema.items);
  if (itemType.length > 1) {
    return [`typed.array(`, ...itemType.map(addIndentation(2)), `)`];
  }
  return [`typed.array(${itemType[0]})`];
}

function renderUnion(variants, mapVariant = renderSchema) {
  const rendered = variants.map((variant) => mapVariant(variant));

  return rendered[0].length > 1 || rendered.length > 3
    ? [`typed.union(`, ...rendered.map(addComma).map(addIndentation(2)), ')']
    : [`typed.union(${rendered.map(addComma)})`];
}

function addComma(item, index, list) {
  if (index === list.length - 1) {
    if (Array.isArray(item)) {
      return item.map(addComma);
    }
    return item + ',';
  }
  return item;
}
