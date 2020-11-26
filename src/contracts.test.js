const { createContract, createNullContract } = require('./contracts');
const { renderAst } = require('./index');

test('object with enum', () => {
  expect(
    renderAst(
      createContract({
        type: 'object',
        required: ['error'],
        properties: {
          error: {
            type: 'string',
            enum: ['invalid_email', 'invalid_password'],
          },
        },
      }),
    ),
  ).toMatchInlineSnapshot(`
    "typed.object({
      error: typed.union(\\"invalid_email\\", \\"invalid_password\\")
    })"
  `);
});

test('nested objects', () => {
  expect(
    renderAst(
      createContract({
        type: 'object',
        required: ['foo'],
        properties: {
          foo: {
            type: 'object',
            description: 'It is just one line',
            required: ['demo'],
            properties: {
              demo: { type: 'string' },
              foo: { type: 'number' },
              bar: { type: 'boolean' },
            },
          },
          bar: {
            type: 'object',
            description: 'It is just one line',
            required: ['demo'],
            properties: {
              demo: {
                type: 'string',
                description: 'It is just one line \n multiline description',
                nullable: true,
              },
            },
          },
        },
      }),
    ),
  ).toMatchInlineSnapshot(`
    "typed.object({
      foo: typed.object({
        demo: typed.string,
        foo: typed.number.optional,
        bar: typed.boolean.optional
      }),
      bar: typed.object({
        demo: typed.string.maybe
      }).optional
    })"
  `);
});

test('array with unions', () => {
  expect(
    renderAst(
      createContract({
        type: 'object',
        required: ['foo'],
        properties: {
          foo: {
            type: 'boolean',
          },
          bar: {
            type: 'array',
            description: 'It is just one line \n multiline description',
            items: {
              type: 'string',
              enum: ['first', 'second', 'third'],
            },
          },
        },
      }),
    ),
  ).toMatchInlineSnapshot(`
    "typed.object({
      foo: typed.boolean,
      bar: typed.array(typed.union(\\"first\\", \\"second\\", \\"third\\")).optional
    })"
  `);
});

test('oneOf', () => {
  expect(
    renderAst(
      createContract({
        oneOf: [
          {
            type: 'object',
            required: ['error'],
            properties: {
              error: {
                type: 'string',
                enum: ['invalid_email', 'invalid_password'],
              },
            },
          },
          {
            type: 'object',
            required: ['foo'],
            properties: {
              foo: {
                type: 'boolean',
              },
              bar: {
                type: 'array',
                description: 'It is just one line \n multiline description',
                items: {
                  type: 'string',
                  enum: ['first', 'second', 'third'],
                },
              },
            },
          },
        ],
      }),
    ),
  ).toMatchInlineSnapshot(`
    "typed.union(typed.object({
      error: typed.union(\\"invalid_email\\", \\"invalid_password\\")
    }), typed.object({
      foo: typed.boolean,
      bar: typed.array(typed.union(\\"first\\", \\"second\\", \\"third\\")).optional
    }))"
  `);
});

test('nullContract', () => {
  expect(renderAst(createNullContract())).toMatchInlineSnapshot(`"typed.nul"`);
});
