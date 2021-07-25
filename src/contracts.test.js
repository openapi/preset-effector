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

test('object without properties', () => {
  expect(
    renderAst(
      createContract({
        type: 'object',
      }),
    ),
  ).toMatchInlineSnapshot(`"typed.object({})"`);
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
      /* It is just one line */
      foo: typed.object({
        demo: typed.string,
        foo: typed.number.optional,
        bar: typed.boolean.optional
      }),

      /* It is just one line */
      bar: typed.object({
        /* It is just one line
         * multiline description */
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

      /* It is just one line
       * multiline description */
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

      /* It is just one line
       * multiline description */
      bar: typed.array(typed.union(\\"first\\", \\"second\\", \\"third\\")).optional
    }))"
  `);
});

test('allOf', () => {
  expect(
    renderAst(
      createContract({
        allOf: [
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
    "typed.intersection(typed.object({
      error: typed.union(\\"invalid_email\\", \\"invalid_password\\")
    }), typed.object({
      foo: typed.boolean,

      /* It is just one line
       * multiline description */
      bar: typed.array(typed.union(\\"first\\", \\"second\\", \\"third\\")).optional
    }))"
  `);
});

test('anyOf', () => {
  expect(
    renderAst(
      createContract({
        anyOf: [
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

      /* It is just one line
       * multiline description */
      bar: typed.array(typed.union(\\"first\\", \\"second\\", \\"third\\")).optional
    }))"
  `);
});

test('nullContract', () => {
  expect(renderAst(createNullContract())).toMatchInlineSnapshot(`"typed.nul"`);
});

test('additionalProperties', () => {
  expect(
    renderAst(
      createContract({
        type: 'object',
        required: ['foo'],
        additionalProperties: {
          type: 'object',
          additionalProperties: true,
          properties: {
            type: {
              type: 'string',
              enum: ['value', 'container'],
            },
          },
        },
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
            additionalProperties: true,
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
      /* It is just one line */
      foo: typed.object({
        demo: typed.string,
        foo: typed.number.optional,
        bar: typed.boolean.optional
      }),

      /* It is just one line */
      bar: typed.object({
        /* It is just one line
         * multiline description */
        demo: typed.string.maybe
      }).optional
    })"
  `);
});
