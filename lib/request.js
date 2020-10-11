const changeCase = require('change-case');
const { addIndentation } = require('./indentation');
const { compileTemplate } = require('./template');
const { renderComments } = require('./comments');
const { renderSchema } = require('./contracts');
const { status } = require('./status');

const EFFECT = `
{{DESCRIPTION_COMMENT}}
export const {{EFFECT_NAME}} = createEffect<{{PARAMS_TYPE_NAME}}, {{DONE_TYPE_NAME}}, {{FAIL_TYPE_NAME}}>({
  async handler() {
    const name = '{{BODY_NAME}}'
    const answer = await requestFx({
      path: '{{REQUEST_PATH}}',
      method: '{{REQUEST_METHOD}}',
    })
{{ANSWER_MATCHER}}
  }
})
`.trim();

const MATCHER = `
switch (answer.status) {
{{VARIANTS}}
  default:
    throw {
      status: 'unknown_status',
      error: { status: answer.status, body: answer.body },
    };
}
`.trim();

const CASE_OK = `
case {{STATUS_CODE}}:
  return {
    status: '{{STATUS_NAME}}',
    answer: parseWith(name, {{CONTRACT_NAME}}, answer.body),
  };
`.trim();

const CASE_ERR = `
case {{STATUS_CODE}}:
  throwWith(
    name,
    {{CONTRACT_NAME}},
    '{{STATUS_NAME}}',
    answer.body,
  );
`.trim();

const INTERFACE_DONE = `
| {
    status: '{{STATUS_NAME}}';
    {{DESCRIPTION}}
    answer: typed.Get<typeof {{CONTRACT_NAME}}>;
  }
`.trim();

function renderRequest({ name, path, method }, requestSchema) {
  const contracts = renderContracts({ name }, requestSchema);
  const effect = renderRequestEffect({ name, path, method }, requestSchema);
  return contracts + '\n' + effect;
}

function renderContracts({ name }, requestSchema) {
  const params = renderContractParams({ name }, requestSchema);
  const done = renderContractDone({ name }, requestSchema);
  const fail = renderContractFail({ name }, requestSchema);

  return [params, done, fail].filter(Boolean).join('\n');
}

function renderContractParams({ name }, requestSchema) {
  return '';
}

function renderContractDone({ name }, requestSchema) {
  const responses = Object.keys(requestSchema.responses)
    .filter((status) => Number(status) < 300)
    .map((statusCode) => ({
      statusCode,
      ...requestSchema.responses[String(statusCode)],
    }));

  const contracts = responses.map((response) => {
    const schema = schemaFromResponse(response);
    const contractContent = schema
      ? renderSchema(schema).join('\n')
      : `typed.undef`;
    const contractName = names.const.contract(name, response.statusCode);

    return `const ${contractName} = ${contractContent};`;
  });

  const union = responses.map(({ statusCode }) =>
    names.const.contract(name, statusCode),
  );
  const done =
    union.join('').length < 50
      ? union.join(', ')
      : `\n${union
          .map(addIndentation(2))
          .map((s) => `${s},`)
          .join('\n')}\n`;
  const contractDone = `const ${names.const.contractDone(
    name,
  )} = typed.union(${done})`;

  const typeDone = `export type ${names.type.done(name)} =`;
  const typeVariants = responses
    .map((response) => {
      const description = response.description
        ? renderComments(response.description)
        : [];
      return compileTemplate(INTERFACE_DONE, {
        DESCRIPTION: description,
        CONTRACT_NAME: names.const.contract(name, response.statusCode),
        STATUS_NAME: names.value.status(response.statusCode),
      })
        .split('\n')
        .map(addIndentation(2))
        .join('\n');
    })
    .concat('  | GenericErrors;');

  return [...contracts, contractDone, typeDone, ...typeVariants].join('\n');
}

function renderContractFail({ name }, requestSchema) {
  return '';
}

function renderRequestEffect({ name: input, path, method }, requestSchema) {
  const name = changeCase.camelCase(input);
  const description = requestSchema.description
    ? renderComments(requestSchema.description)
    : [];

  return compileTemplate(EFFECT, {
    REQUEST_PATH: path,
    REQUEST_METHOD: changeCase.constantCase(method),

    DESCRIPTION_COMMENT: description.join('\n'),
    EFFECT_NAME: names.const.fx(name),
    BODY_NAME: names.value.body(name),

    PARAMS_TYPE_NAME: names.type.params(name),
    DONE_TYPE_NAME: names.type.done(name),
    FAIL_TYPE_NAME: names.type.fail(name),

    ANSWER_MATCHER: renderAnswerMatcher({ name }, requestSchema.responses),
  });
}

function renderAnswerMatcher({ name }, responses) {
  const variants = Object.keys(responses).map((statusCode) =>
    renderOneMatcher({ name }, Number.parseInt(statusCode, 10)),
  );
  return compileTemplate(MATCHER, {
    VARIANTS: variants.join('\n'),
  })
    .split('\n')
    .map(addIndentation(4))
    .join('\n');
}

function renderOneMatcher({ name }, statusCode) {
  const template = statusCode > 400 ? CASE_ERR : CASE_OK;
  return compileTemplate(template, {
    STATUS_CODE: statusCode,
    STATUS_NAME: names.value.status(statusCode),
    CONTRACT_NAME: names.const.contract(name, statusCode),
  })
    .split('\n')
    .map(addIndentation(2))
    .join('\n');
}

function schemaFromResponse(response) {
  if (
    response &&
    response.content &&
    response.content['application/json'] &&
    response.content['application/json'].schema
  ) {
    return response.content['application/json'].schema;
  }
}

// `name` should be in camelCase
const names = {
  type: {
    params: (name) => `${changeCase.pascalCase(name)}`,
    done: (name) => `${changeCase.pascalCase(name)}Done`,
    fail: (name) => `${changeCase.pascalCase(name)}Fail`,
  },
  value: {
    status: (statusCode) => changeCase.snakeCase(status[statusCode].label),
    body: (name) => `${name}.body`,
  },
  const: {
    contract: (name, statusCode) =>
      name + changeCase.pascalCase(status[statusCode].label),
    fx: (name) => `${name}Fx`,
    contractDone: (name) => `${name}Done`,
    contractFail: (name) => `${name}Fail`,
  },
};

module.exports = { renderRequest };
