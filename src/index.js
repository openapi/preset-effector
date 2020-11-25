const changeCase = require('change-case');
const generate = require('@babel/generator').default;
const template = require('@babel/template').default;
const t = require('@babel/types');
const { status } = require('./status');

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

function createEffect(
  { name, path, method },
  { description, requestBody, responses },
) {
  const constName = changeCase.camelCase(name);
  const TypeName = changeCase.pascalCase(name);

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
  t.addComment(expression, 'leading', description);
  return expression;
}

function renderRequest() {
  const ast = createEffect(
    {
      name: 'register-confirmation',
      path: '/register/confirmation',
      method: 'post',
    },
    {
      operationId: 'accessRecoverySendEmail',
      tags: ['Access Recovery'],
      description: 'Send password recovery confirmation code to email',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email'],
              properties: {
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'user@gmail.com',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Password changed successfully',
        },
        202: {
          description: 'Reset code or password is invalid',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['error'],
                properties: {
                  error: {
                    type: 'string',
                    enum: ['invalid_email', 'invalid_password'],
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Reset code or password is invalid',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['error'],
                properties: {
                  error: {
                    type: 'string',
                    enum: ['invalid_email', 'invalid_password'],
                  },
                },
              },
            },
          },
        },
        500: {
          description: 'Something goes wrong',
        },
      },
    },
  );

  return generate(ast, {
    plugins: ['typescript'],
    jsescOption: { compact: false },
  }).code;
}

module.exports = { renderRequest };
