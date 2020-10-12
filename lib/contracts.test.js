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
        foo: typed.string.optional,
        // It is just one line
        // multiline description
        bar: typed.string.optional,
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
            demo: typed.string.optional,
        }).optional,
      })"
    `);
  });

  it('should render object with nullable and required properties', () => {
    expect(
      renderSchema({
        type: 'object',
        required: ['foo', 'ral'],
        properties: {
          foo: {
            type: 'string',
            description: 'It is just one line',
          },
          bar: {
            type: 'string',
            description: 'It is just one line \n multiline description',
          },
          baz: {
            type: 'number',
            nullable: true,
          },
          ral: {
            type: 'boolean',
            nullable: true,
          },
        },
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      "typed.object({
        // It is just one line
        foo: typed.string,
        // It is just one line
        // multiline description
        bar: typed.string.optional,
        baz: typed.number.optional,
        ral: typed.boolean,
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
        ).optional,
        // It is just one line
        // multiline description
        bar: typed.string.optional,
      })"
    `);
  });
});

describe('numbers', () => {
  it('should render object with numbers', () => {
    expect(
      renderSchema({
        type: 'object',
        required: ['foo'],
        properties: {
          foo: {
            type: 'integer',
          },
          bar: {
            type: 'number',
            description: 'It is just one line \n multiline description',
          },
        },
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      "typed.object({
        foo: typed.number,
        // It is just one line
        // multiline description
        bar: typed.number.optional,
      })"
    `);
  });
});

describe('boolean', () => {
  it('should render object with numbers', () => {
    expect(
      renderSchema({
        type: 'object',
        required: ['foo'],
        properties: {
          foo: {
            type: 'boolean',
          },
          bar: {
            type: 'boolean',
            description: 'It is just one line \n multiline description',
          },
        },
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      "typed.object({
        foo: typed.boolean,
        // It is just one line
        // multiline description
        bar: typed.boolean.optional,
      })"
    `);
  });
});

describe('arrays', () => {
  test('with simple types', () => {
    expect(
      renderSchema({
        type: 'array',
        items: { type: 'string' },
      }).join('\n'),
    ).toMatchInlineSnapshot(`"typed.array(typed.string)"`);

    expect(
      renderSchema({
        type: 'array',
        items: { type: 'boolean' },
      }).join('\n'),
    ).toMatchInlineSnapshot(`"typed.array(typed.boolean)"`);

    expect(
      renderSchema({
        type: 'array',
        items: { type: 'number' },
      }).join('\n'),
    ).toMatchInlineSnapshot(`"typed.array(typed.number)"`);
  });

  test('of objects', () => {
    expect(
      renderSchema({
        type: 'array',
        items: {
          type: 'object',
          required: ['foo'],
          properties: {
            foo: {
              type: 'boolean',
            },
            bar: {
              type: 'boolean',
              description: 'It is just one line \n multiline description',
            },
          },
        },
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      "typed.array(
        typed.object({
          foo: typed.boolean,
          // It is just one line
          // multiline description
          bar: typed.boolean.optional,
        })
      )"
    `);
  });

  test('of array of objects', () => {
    expect(
      renderSchema({
        type: 'array',
        items: {
          type: 'array',
          items: {
            type: 'object',
            required: ['foo'],
            properties: {
              foo: {
                type: 'boolean',
              },
              bar: {
                type: 'boolean',
                description: 'It is just one line \n multiline description',
              },
            },
          },
        },
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      "typed.array(
        typed.array(
          typed.object({
            foo: typed.boolean,
            // It is just one line
            // multiline description
            bar: typed.boolean.optional,
          })
        )
      )"
    `);
  });

  test('array of union in object', () => {
    expect(
      renderSchema({
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
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      "typed.object({
        foo: typed.boolean,
        // It is just one line
        // multiline description
        bar: typed.array(typed.union('first', 'second', 'third')).optional,
      })"
    `);
  });
});
