const changeCase = require('change-case');
const generate = require('@babel/generator').default;
const template = require('@babel/template').default;
const t = require('@babel/types');
const { status } = require('./status');
const {
  createContract,
  createNullContract,
  addComment,
} = require('./contracts');

const exportConst = template(`export const %%name%% = %%value%%;`, {
  plugins: ['typescript'],
});

const handlerFunction = template(
  `{
  const name = %%name%%;
  const answer = await requestFx({
    path: %%path%%,
    method: %%method%%,
  });
  %%statuses%%
}`,
  { allowAwaitOutsideFunction: true },
);

const switchStatus = template(`
  switch (answer.status) {
    default:
      throw {
        status: 'unknown_status',
        error: { status: answer.status, body: answer.body },
      };
  }
`);

const caseStatus = template(`
  return {
    status: %%status%%,
    answer: parseWith(name, %%contractName%%, answer.body)
  };
`);

const caseFail = template(`
  throw createError(
    name,
    %%contractName%%,
    %%status%%,
    answer.body
  );
`);

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

function createEffect(
  { name, path, method },
  { description, requestBody, responses },
) {
  const constName = changeCase.camelCase(name);
  const TypeName = changeCase.pascalCase(name);

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

    function wrap(content) {
      return t.switchCase(t.numericLiteral(code), [content]);
    }

    if (code >= 400) {
      return wrap(
        caseFail({
          contractName: t.identifier(contractName),
          status: t.stringLiteral(statusName),
        }),
      );
    }

    return wrap(
      caseStatus({
        status: t.stringLiteral(statusName),
        contractName: t.identifier(contractName),
      }),
    );
  });

  const statuses = switchStatus();
  statuses.cases.unshift(...cases);

  const effectCall = t.callExpression(t.identifier('createEffect'), [
    t.objectExpression([
      t.objectMethod(
        'method',
        t.identifier('handler'),
        [],
        handlerFunction({
          name: t.stringLiteral(`${constName}.body`),
          path: t.stringLiteral(path),
          method: t.stringLiteral(method.toUpperCase()),
          statuses,
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
  addComment(expression, description);

  return [...doneContracts, doneTypes, ...failContracts, failTypes, expression];
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
