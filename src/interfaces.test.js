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
      foo: {
        demo: string;
        foo?: number;
        bar?: boolean;
      };
      bar?: {
        demo: string | null;
      };
    }"
  `);
});
