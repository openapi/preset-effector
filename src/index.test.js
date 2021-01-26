const { createEffect, renderProgram } = require('./index');

test('render', () => {
  expect(
    renderProgram(
      createEffect(
        {
          name: 'register-confirmation',
          path: '/register/{first}/confirmation/{second}',
          method: 'post',
        },
        {
          operationId: 'accessRecoverySendEmail',
          tags: ['Access Recovery'],
          description:
            'Send password recovery confirmation code to email\nAdd another example description\nThis is just a demo',
          parameters: [
            {
              name: 'first',
              in: 'path',
              description: 'Just a stub parameter',
              // Should be overriden to `true` when `in: path`
              required: false,
              schema: { type: 'string' },
            },
            {
              name: 'second',
              in: 'path',
              description: 'This is a example',
              required: true,
              schema: { type: 'integer', format: 'int64' },
            },
            {
              name: 'id',
              in: 'query',
              description: 'ID of the object to fetch',
              required: false,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'math',
              in: 'query',
              description: 'Algebra to use',
              required: true,
              schema: {
                type: 'string',
                enum: ['hk86', 'hk84', 'dt14'],
              },
            },
            {
              name: 'X-Token',
              in: 'header',
              required: true,
              description: 'Super authentication token',
              schema: { type: 'string' },
            },
            {
              name: 'Hello',
              in: 'header',
              required: false,
              schema: {
                type: 'integer',
              },
            },
            {
              name: 'theme',
              in: 'cookie',
              required: false,
              description: 'Theme of user interface',
              schema: { type: 'string', enum: ['dark', 'light', 'auto'] },
            },
            {
              name: 'lastUpdated',
              in: 'cookie',
              required: false,
              schema: {
                type: 'integer',
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  description:
                    'Send password recovery confirmation code to email\nAdd another example description\nThis is just a demo',
                  type: 'object',
                  required: ['email'],
                  properties: {
                    email: {
                      description:
                        'Send password recovery confirmation code to email\nAdd another example description\nThis is just a demo',
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
                    description:
                      'Send password recovery confirmation code to email\nAdd another example description\nThis is just a demo',
                    type: 'object',
                    required: ['error'],
                    properties: {
                      error: {
                        description:
                          'Send password recovery confirmation code to email\nAdd another example description\nThis is just a demo',
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
                    description:
                      'Send password recovery confirmation code to email\nAdd another example description\nThis is just a demo',
                    type: 'object',
                    required: ['error'],
                    properties: {
                      error: {
                        description:
                          'Send password recovery confirmation code to email\nAdd another example description\nThis is just a demo',
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
        {
          requestName: 'requestFx',
        },
      ),
    ),
  ).toMatchInlineSnapshot(`
    "export type RegisterConfirmation = {
      body: {
        /* Send password recovery confirmation code to email
         * Add another example description
         * This is just a demo */
        email: string;
      };
      path: {
        /* Just a stub parameter */
        first?: string;

        /* This is a example */
        second: number;
      };
      query: {
        /* ID of the object to fetch */
        id?: string;

        /* Algebra to use */
        math: \\"hk86\\" | \\"hk84\\" | \\"dt14\\";
      };
      header: {
        /* Super authentication token */
        \\"X-Token\\": string;
        Hello?: number;
      };
      cookie?: {
        /* Theme of user interface */
        theme?: \\"dark\\" | \\"light\\" | \\"auto\\";
        lastUpdated?: number;
      };
    };

    /* Password changed successfully */
    export const registerConfirmationOk = typed.nul;

    /* Reset code or password is invalid */
    export const registerConfirmationAccepted = typed.object({
      /* Send password recovery confirmation code to email
       * Add another example description
       * This is just a demo */
      error: typed.union(\\"invalid_email\\", \\"invalid_password\\")
    });
    export type RegisterConfirmationDone = {
      status: \\"ok\\";
      answer: typed.Get<typeof registerConfirmationOk>;
    } | {
      status: \\"accepted\\";
      answer: typed.Get<typeof registerConfirmationAccepted>;
    };

    /* Reset code or password is invalid */
    export const registerConfirmationBadRequest = typed.object({
      /* Send password recovery confirmation code to email
       * Add another example description
       * This is just a demo */
      error: typed.union(\\"invalid_email\\", \\"invalid_password\\")
    });

    /* Something goes wrong */
    export const registerConfirmationInternalServerError = typed.nul;
    export type RegisterConfirmationFail = {
      status: \\"bad_request\\";
      error: typed.Get<typeof registerConfirmationBadRequest>;
    } | {
      status: \\"internal_server_error\\";
      error: typed.Get<typeof registerConfirmationInternalServerError>;
    } | GenericErrors;

    /* Send password recovery confirmation code to email
     * Add another example description
     * This is just a demo */
    export const registerConfirmation = createEffect<RegisterConfirmation, RegisterConfirmationDone, RegisterConfirmationFail>({
      async handler({
        body,
        path,
        query,
        header,
        cookie
      }) {
        const name = \\"registerConfirmation.body\\";
        const response = await requestFx({
          path: \`/register/\${path.first}/confirmation/\${path.second}\`,
          method: \\"POST\\",
          body,
          query,
          header,
          cookie
        });
        return parseByStatus(name, response, {
          200: [\\"ok\\", registerConfirmationOk],
          202: [\\"accepted\\", registerConfirmationAccepted],
          400: [\\"bad_request\\", registerConfirmationBadRequest],
          500: [\\"internal_server_error\\", registerConfirmationInternalServerError]
        });
      }

    });"
  `);
});
