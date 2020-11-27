const t = require('@babel/types');

const create = {
  object(schema) {
    return t.tsTypeLiteral(
      Object.keys(schema.properties).map((name) => {
        const property = t.tsPropertySignature(
          t.identifier(name),
          t.tsTypeAnnotation(
            createInterface(
              schema.properties[name],
              (schema.required || []).includes(name),
            ),
          ),
        );
        property.optional = (schema.required || []).includes(name) === false;
        return property;
      }),
    );
  },
  string(schema) {
    if (schema.enum) {
      return t.tsUnionType(
        schema.enum.map((variant) => t.tsLiteralType(t.stringLiteral(variant))),
      );
    }
    return t.tsStringKeyword();
    // add enum
  },
  number(_schema) {
    return t.tsNumberKeyword();
  },
  integer(schema) {
    return create.number(schema);
  },
  boolean(_schema) {
    return t.tsBooleanKeyword();
  },
  array(schema) {
    return t.tsArrayType(createInterface(schema.items));
  },
};

function createInterface(schema, required = true) {
  // Add oneOf
  // Add allOf
  // Add anyOf

  const creator = create[schema.type];
  if (!creator) {
    console.info(schema);
    throw new Error(`type "${schema.type}" is not supported by interfaces`);
  }
  let ast = creator(schema);
  // add !required
  if (schema.nullable) {
    ast = t.tsUnionType([ast, t.tsNullKeyword()]);
  }
  return ast;
}

module.exports = { createInterface };
