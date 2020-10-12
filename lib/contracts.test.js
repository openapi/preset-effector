const { renderSchema } = require('./contracts');

describe('object', () => {
  it('should render object with properties', () => {
    expect(
      renderSchema({
        type: 'object',
        properties: {
          foo: {
            type: 'string',
            description: 'It is just one line',
          },
          bar: {
            type: 'string',
            description: 'It is just one line \n multiline description',
          },
        },
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      "typed.object({
        // It is just one line
        foo: typed.string.maybe,
        // It is just one line
        // multiline description
        bar: typed.string.maybe,
      })"
    `);
  });

  it('should render object with required properties', () => {
    expect(
      renderSchema({
        type: 'object',
        required: ['foo', 'bar'],
        properties: {
          foo: {
            type: 'string',
            description: 'It is just one line',
          },
          bar: {
            type: 'string',
            description: 'It is just one line \n multiline description',
          },
        },
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      "typed.object({
        // It is just one line
        foo: typed.string,
        // It is just one line
        // multiline description
        bar: typed.string,
      })"
    `);
  });

  it('should render nested objects with required properties', () => {
    expect(
      renderSchema({
        type: 'object',
        required: ['foo'],
        properties: {
          foo: {
            type: 'object',
            description: 'It is just one line',
            required: ['demo'],
            properties: {
              demo: { type: 'string' },
            },
          },
          bar: {
            type: 'object',
            description: 'It is just one line',
            properties: {
              demo: {
                type: 'string',
                description: 'It is just one line \n multiline description',
              },
            },
          },
        },
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      "typed.object({
        // It is just one line
        foo: typed.object({
            demo: typed.string,
        }),
        // It is just one line
        bar: typed.object({
            // It is just one line
            // multiline description
            demo: typed.string.maybe,
        }).maybe,
      })"
    `);
  });
});

describe('string with enum', () => {
  it('should render object with enum', () => {
    expect(
      renderSchema({
        type: 'object',
        properties: {
          foo: {
            type: 'string',
            description: 'It is just one line',
            enum: [
              'access_denied',
              'invalid_request',
              'invalid_scope',
              'server_error',
              'temporarily_unavailable',
              'unauthenticated_user',
              'unauthorized_client',
              'unsupported_response_type',
            ],
          },
          bar: {
            type: 'string',
            description: 'It is just one line \n multiline description',
          },
        },
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      "typed.object({
        // It is just one line
        foo: typed.union(
            'access_denied',
            'invalid_request',
            'invalid_scope',
            'server_error',
            'temporarily_unavailable',
            'unauthenticated_user',
            'unauthorized_client',
            'unsupported_response_type',
        ).maybe,
        // It is just one line
        // multiline description
        bar: typed.string.maybe,
      })"
    `);
  });
});
