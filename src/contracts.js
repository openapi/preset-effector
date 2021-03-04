const t = require('@babel/types');
const changeCase = require('change-case');
const { addComment } = require('./comments');

const create = {
  object(schema) {
    const properties = schema.properties
      ? Object.keys(schema.properties).map((name) => {
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
        })
      : [];

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
    let item = anyContract();
    if (schema.items && Object.keys(schema.items).length !== 0) {
      item = createContract(schema.items);
    }

    return t.callExpression(
      t.memberExpression(t.identifier('typed'), t.identifier('array')),
      [item],
    );
  },
};

function anyContract() {
  return t.memberExpression(t.identifier('custom'), t.identifier('any'));
}

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

function referenceToContract(name) {
  return t.identifier(changeCase.camelCase(name));
}

function getNameFromRef(ref) {
  return ref.split('/').pop();
}

function correctType(schema) {
  if (!schema.type) {
    if (typeof schema.properties === 'object') {
      schema.type = 'object';
    }
    if (typeof schema.items === 'object') {
      schema.type = 'array';
    }
  }
}

function createContract(schema, required = true) {
  correctType(schema);

  const creator = create[schema.type];
  if (!creator) {
    if (schema.oneOf) return oneOf(schema.oneOf);
    if (schema.anyOf) return anyOf(schema.anyOf);
    if (schema.allOf) return allOf(schema.allOf);
    if (schema.$ref) return referenceToContract(getNameFromRef(schema.$ref));

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
