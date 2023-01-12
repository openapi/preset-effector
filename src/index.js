const changeCase = require('change-case');
const generate = require('@babel/generator').default;
const template = require('@babel/template').default;
const t = require('@babel/types');

const { status } = require('./status');
const { addComment } = require('./comments');
const { createInterface } = require('./interfaces');
const { createContract, createNullContract } = require('./contracts');
const { stringPathToLiteral } = require('./path-literal');

const exportConst = template(`export const %%name%% = %%value%%;`, {
  plugins: ['typescript'],
});

const handlerFunctionBody = template(
  `{
  const name = %%name%%;
  const response = await %%requestFx%%(%%params%%);
  return %%statusParser%%;
}`,
  { allowAwaitOutsideFunction: true },
);

function contractGet({ contractName }) {
  return t.tsTypeReference(
    t.tsQualifiedName(t.identifier('typed'), t.identifier('Get')),
    t.tsTypeParameterInstantiation([
      t.tsTypeQuery(t.identifier(changeCase.camelCase(contractName))),
    ]),
  );
}

function createTypeDoneVariant({ status, contractName }) {
  /**
   * status: 'ok';
   * answer: typed.Get<typeof registerRequestOk>;
   */
  return t.tsTypeLiteral([
    t.tsPropertySignature(
      t.identifier('status'),
      t.tsTypeAnnotation(t.tsLiteralType(t.stringLiteral(status))),
    ),
    t.tsPropertySignature(
      t.identifier('answer'),
      t.tsTypeAnnotation(contractGet({ contractName })),
    ),
  ]);
}

function createDoneContracts(name, responses) {
  const variants = Object.keys(responses).filter((code) => code < 400);

  const contracts = variants.map((code) => {
    const contractName =
      changeCase.camelCase(name) + changeCase.pascalCase(status[code].code);
    const contract = responses[code].content
      ? createContract(responses[code].content['application/json'].schema)
      : createNullContract();
    const ast = t.exportNamedDeclaration(
      t.variableDeclaration('const', [
        t.variableDeclarator(t.identifier(contractName), contract),
      ]),
    );
    if (responses[code].description) {
      addComment(ast, responses[code].description);
    }
    return ast;
  });
  return contracts;
}

const propertyNameMatch = /^\w+$/i;

function createPropertyName(name) {
  if (name.match(propertyNameMatch)) {
    return t.identifier(name);
  }
  return t.stringLiteral(name);
}

function createParamsTypes(name, { requestBody, parameters }) {
  const members = [];

  if (requestBody) {
    const schema = requestBody.content['application/json']?.schema 
      || requestBody.content['multipart/form-data'].schema;
    
    const member = t.tsPropertySignature(
      t.identifier('body'),
      t.tsTypeAnnotation(createInterface(schema)),
    );
    member.optional = !requestBody.required;
    members.push(member);
  }

  // If at least one parameter is required, property in params should be required
  const dataTypes = {};
  for (const parameter of parameters) {
    if (!dataTypes[parameter.in])
      dataTypes[parameter.in] = { required: false, children: [] };

    const passedType = dataTypes[parameter.in];
    passedType.required = passedType.required || parameter.required;
    passedType.children.push(parameter);
  }

  // Convert list of parameters to property signature
  for (const name in dataTypes) {
    const { required, children } = dataTypes[name];
    const schema = t.tsTypeLiteral(
      children.map(({ name, required, schema, content, description }) => {
        const property = t.tsPropertySignature(
          createPropertyName(name),
          t.tsTypeAnnotation(
            createInterface(schema || content['application/json'].schema),
          ),
        );
        if (description) addComment(property, description);
        property.optional = !required;
        return property;
      }),
    );
    const member = t.tsPropertySignature(
      t.identifier(name),
      t.tsTypeAnnotation(schema),
    );
    member.optional = !required;
    members.push(member);
  }

  return t.exportNamedDeclaration(
    t.tsTypeAliasDeclaration(
      t.identifier(changeCase.pascalCase(name)),
      null,
      t.tsTypeLiteral(members),
    ),
  );
}

function createDoneTypes(name, responses) {
  const variants = Object.keys(responses).filter((code) => code < 400);

  const types = variants.map((code) =>
    createTypeDoneVariant({
      status: changeCase.snakeCase(status[code].code),
      contractName: `${name}${changeCase.pascalCase(status[code].code)}`,
    }),
  );

  return t.exportNamedDeclaration(
    t.tsTypeAliasDeclaration(
      t.identifier(`${changeCase.pascalCase(name)}Done`),
      null,
      t.tsUnionType(types),
    ),
  );
}

function createFailContracts(name, responses) {
  const variants = Object.keys(responses).filter((code) => code >= 400);

  const contracts = variants.map((code) => {
    const contractName =
      changeCase.camelCase(name) + changeCase.pascalCase(status[code].code);
    const contract = responses[code].content
      ? createContract(responses[code].content['application/json'].schema)
      : createNullContract();
    const ast = t.exportNamedDeclaration(
      t.variableDeclaration('const', [
        t.variableDeclarator(t.identifier(contractName), contract),
      ]),
    );
    if (responses[code].description) {
      addComment(ast, responses[code].description);
    }
    return ast;
  });
  return contracts;
}

function createTypeFailVariant({ status, contractName }) {
  /**
   * status: %%status%%;
   * error: typed.Get<typeof %%contractName%%>;
   */
  return t.tsTypeLiteral([
    t.tsPropertySignature(
      t.identifier('status'),
      t.tsTypeAnnotation(t.tsLiteralType(t.stringLiteral(status))),
    ),
    t.tsPropertySignature(
      t.identifier('error'),
      t.tsTypeAnnotation(contractGet({ contractName })),
    ),
  ]);
}

function createFail(name, responses) {
  const variants = Object.keys(responses)
    .filter((code) => code >= 400)
    .map((code) =>
      createTypeFailVariant({
        status: changeCase.snakeCase(status[code].code),
        contractName: `${name}${changeCase.pascalCase(status[code].code)}`,
      }),
    );
  return t.exportNamedDeclaration(
    t.tsTypeAliasDeclaration(
      t.identifier(`${changeCase.pascalCase(name)}Fail`),
      null,
      t.tsUnionType([
        ...variants,
        t.tsTypeReference(t.identifier('GenericErrors')),
      ]),
    ),
  );
}

function createPath({ path }, { parameters = [] }) {
  const pathParameters = parameters.filter((param) => param.in === 'path');
  const literal = stringPathToLiteral(path);
  if (literal === null) return t.stringLiteral(path);

  const availableParameters = pathParameters.map((element) => element.name);
  literal.expressions.forEach((name) => {
    if (!availableParameters.includes(name)) {
      console.warn(
        `Warning for "${path}": parameter "${name}" not found in parameters object\n` +
          `Add { name: "${name}", in: "path" } to parameters object`,
      );
    }
  });

  return t.templateLiteral(
    literal.quasis.map((raw, index) =>
      t.templateElement({ raw }, index === literal.quasis.length - 1),
    ),
    literal.expressions.map((name) =>
      t.memberExpression(t.identifier('path'), t.identifier(name)),
    ),
  );
}

function detectDestructuring({ parameters, requestBody }) {
  const destructuring = {};

  if (requestBody) destructuring.body = true;

  for (const { in: place } of parameters) {
    destructuring[place] = true;
  }
  return destructuring;
}

function createHandlerParams({ parameters = [], requestBody }) {
  if (parameters.length === 0 && !requestBody) {
    return [];
  }
  const destructuring = detectDestructuring({ parameters, requestBody });

  return [
    t.objectPattern(
      Object.keys(destructuring).map((name) =>
        t.objectProperty(t.identifier(name), t.identifier(name), false, true),
      ),
    ),
  ];
}

function createRequestParams(
  { method, path },
  { parameters = [], requestBody },
) {
  const destructuring = detectDestructuring({ parameters, requestBody });

  return t.objectExpression([
    t.objectProperty(
      t.identifier('path'),
      createPath({ path }, { parameters }),
    ),
    t.objectProperty(
      t.identifier('method'),
      t.stringLiteral(method.toUpperCase()),
    ),
    // Path params used only in path literal
    ...Object.keys(destructuring)
      .filter((param) => param !== 'path')
      .map((name) =>
        t.objectProperty(t.identifier(name), t.identifier(name), false, true),
      ),
  ]);
}

function createEffect(
  { name, path, method },
  { description, requestBody, responses, parameters = [] },
  { requestName } = {},
) {
  const constName = changeCase.camelCase(name);
  const TypeName = changeCase.pascalCase(name);

  const paramsTypes = createParamsTypes(name, { requestBody, parameters });

  const doneContracts = createDoneContracts(name, responses);
  const failContracts = createFailContracts(name, responses);
  const doneTypes = createDoneTypes(name, responses);
  const failTypes = createFail(name, responses);

  const cases = Object.keys(responses).map((_code) => {
    const code = Number.parseInt(_code, 10);
    const statusName = changeCase.snakeCase(status[code].code);
    const contractName = `${constName}${changeCase.pascalCase(
      status[code].label,
    )}`;

    return t.objectProperty(
      t.numericLiteral(code),
      t.arrayExpression([
        t.stringLiteral(statusName),
        t.identifier(contractName),
      ]),
    );
  });

  const statusParser = t.callExpression(t.identifier('parseByStatus'), [
    t.identifier('name'),
    t.identifier('response'),
    t.objectExpression(cases),
  ]);

  // TODO: add params for body

  const effectCall = t.callExpression(t.identifier('createEffect'), [
    t.objectExpression([
      t.objectMethod(
        'method',
        t.identifier('handler'),
        createHandlerParams({ parameters, requestBody }),
        handlerFunctionBody({
          name: t.stringLiteral(`${constName}.body`),
          params: createRequestParams(
            { path, method },
            { parameters, requestBody },
          ),
          statusParser,
          requestFx: t.identifier(requestName),
        }),
        false,
        false,
        true,
      ),
    ]),
  ]);
  effectCall.typeParameters = t.tsTypeParameterInstantiation([
    t.tsTypeReference(t.identifier(`${TypeName}`)),
    t.tsTypeReference(t.identifier(`${TypeName}Done`)),
    t.tsTypeReference(t.identifier(`${TypeName}Fail`)),
  ]);

  const expression = exportConst({
    name: t.identifier(constName),
    value: effectCall,
  });
  if (description) {
    addComment(expression, description);
  }

  return [
    paramsTypes,
    ...doneContracts,
    doneTypes,
    ...failContracts,
    failTypes,
    expression,
  ];
}

function renderProgram(nodes) {
  return renderAst(t.program([...nodes]));
}

function renderAst(ast) {
  return generate(ast, {
    plugins: ['typescript'],
    jsescOption: { compact: false },
  }).code;
}

module.exports = { createEffect, renderProgram, renderAst };
