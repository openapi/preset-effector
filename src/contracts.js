const t = require('@babel/types');
const { addComment } = require('./comments');

const create = {
  object(schema) {
    const properties = Object.keys(schema.properties || {}).map((name) => {
      const property = t.objectProperty(
        t.identifier(name),
        createContract(
          schema.properties[name],
          (schema.required || []).includes(name),
        ),
      );

      if (schema.properties[name].description) {
        addComment(property, schema.properties[name].description);
      }

      return property;
    });
    return t.callExpression(
      t.memberExpression(t.identifier('typed'), t.identifier('object')),
      [t.objectExpression(properties)],
    );
  },
  string(schema) {
    if (schema.enum) {
      return t.callExpression(
        t.memberExpression(t.identifier('typed'), t.identifier('union')),
        schema.enum.map((variant) => t.stringLiteral(variant)),
      );
    }
    return t.memberExpression(t.identifier('typed'), t.identifier('string'));
  },
  number(_schema) {
    return t.memberExpression(t.identifier('typed'), t.identifier('number'));
  },
  integer(schema) {
    return create.number(schema);
  },
  boolean(_schema) {
    return t.memberExpression(t.identifier('typed'), t.identifier('boolean'));
  },
  array(schema) {
    return t.callExpression(
      t.memberExpression(t.identifier('typed'), t.identifier('array')),
      [createContract(schema.items)],
    );
  },
};

function oneOf(variants) {
  return t.callExpression(
    t.memberExpression(t.identifier('typed'), t.identifier('union')),
    variants.map((schema) => createContract(schema)),
  );
}

function anyOf(variants) {
  console.warn('anyOf is not supported');
  return oneOf(variants);
}

function allOf(variants) {
  return t.callExpression(
    t.memberExpression(t.identifier('typed'), t.identifier('intersection')),
    variants.map((schema) => createContract(schema)),
  );
}

function createContract(schema, required = true) {
  if (schema.oneOf) return oneOf(schema.oneOf);
  if (schema.anyOf) return anyOf(schema.anyOf);
  if (schema.allOf) return allOf(schema.allOf);

  const creator = create[schema.type || 'object'];
  if (!creator) {
    console.info(schema);
    throw new Error(`type "${schema.type}" is not supported by contracts`);
  }
  let ast = creator(schema);

  if (schema.nullable) {
    ast = t.memberExpression(ast, t.identifier('maybe'));
  } else if (!required) {
    ast = t.memberExpression(ast, t.identifier('optional'));
  }

  return ast;
}

function createNullContract() {
  return t.memberExpression(t.identifier('typed'), t.identifier('nul'));
}

module.exports = { createContract, createNullContract };
