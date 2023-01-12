const t = require('@babel/types');
const { addComment } = require('./comments');

const create = {
  object(schema) {
    const properties = Object.keys(schema.properties || {}).map((name) => {
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
      if (schema.properties[name].description) {
        addComment(property, schema.properties[name].description);
      }
      return property;
    });

    if (schema.additionalProperties) {
      const index =
        schema.additionalProperties === true
          ? t.tsUnknownKeyword()
          : createInterface(schema.additionalProperties);

      const stringKey = t.identifier('key');
      stringKey.typeAnnotation = t.tsTypeAnnotation(t.tsStringKeyword());

      properties.push(
        t.tsIndexSignature([stringKey], t.tsTypeAnnotation(index)),
      );
    }

    return t.tsTypeLiteral(properties);
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

function oneOf(variants) {
  return t.tsUnionType(variants.map((variant) => createInterface(variant)));
}

function allOf(variants) {
  return t.tsIntersectionType(
    variants.map((variant) => createInterface(variant)),
  );
}

function anyOf(variants) {
  return t.tsIntersectionType(
    variants.map((variant) =>
      t.tsTypeReference(
        t.identifier('Partial'),
        t.tsTypeParameterInstantiation([createInterface(variant)]),
      ),
    ),
  );
}

function createInterface(schema, _required = true) {
  if (schema.oneOf) return oneOf(schema.oneOf);
  if (schema.allOf) return allOf(schema.allOf);
  if (schema.anyOf) return anyOf(schema.anyOf);

  const creator = create[schema.type || 'object'];

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
