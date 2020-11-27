const { createInterface } = require('./interfaces');
const { renderAst } = require('./index');

test('object', () => {
  // no-op
  expect(
    renderAst(
      createInterface({
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
    "{
      error: \\"invalid_email\\" | \\"invalid_password\\";
    }"
  `);
});

test('nested objects', () => {
  expect(
    renderAst(
      createInterface({
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
    "{
      /* It is just one line */
      foo: {
        demo: string;
        foo?: number;
        bar?: boolean;
      };

      /* It is just one line */
      bar?: {
        /* It is just one line
         * multiline description */
        demo: string | null;
      };
    }"
  `);
});

test('oneOf', () => {
  expect(
    renderAst(
      createInterface({
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
    "{
      error: \\"invalid_email\\" | \\"invalid_password\\";
    } | {
      foo: boolean;

      /* It is just one line
       * multiline description */
      bar?: (\\"first\\" | \\"second\\" | \\"third\\")[];
    }"
  `);
});

test('allOf', () => {
  expect(
    renderAst(
      createInterface({
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
    "{
      error: \\"invalid_email\\" | \\"invalid_password\\";
    } & {
      foo: boolean;

      /* It is just one line
       * multiline description */
      bar?: (\\"first\\" | \\"second\\" | \\"third\\")[];
    }"
  `);
});

test('anyOf', () => {
  expect(
    renderAst(
      createInterface({
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
    "Partial<{
      error: \\"invalid_email\\" | \\"invalid_password\\";
    }> & Partial<{
      foo: boolean;

      /* It is just one line
       * multiline description */
      bar?: (\\"first\\" | \\"second\\" | \\"third\\")[];
    }>"
  `);
});
