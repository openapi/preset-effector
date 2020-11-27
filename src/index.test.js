const { createEffect, renderProgram } = require('./index');

test('render', () => {
  expect(
    renderProgram(
      createEffect(
        {
          name: 'register-confirmation',
          path: '/register/confirmation',
          method: 'post',
        },
        {
          operationId: 'accessRecoverySendEmail',
          tags: ['Access Recovery'],
          description:
            'Send password recovery confirmation code to email\nAdd another example description\nThis is just a demo',
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
      ),
    ),
  ).toMatchInlineSnapshot(`
    "/* Password changed successfully */
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
      async handler() {
        const name = \\"registerConfirmation.body\\";
        const answer = await requestFx({
          path: \\"/register/confirmation\\",
          method: \\"POST\\"
        });

        switch (answer.status) {
          case 200:
            return {
              status: \\"ok\\",
              answer: parseWith(name, registerConfirmationOk, answer.body)
            };

          case 202:
            return {
              status: \\"accepted\\",
              answer: parseWith(name, registerConfirmationAccepted, answer.body)
            };

          case 400:
            throw createError(name, registerConfirmationBadRequest, \\"bad_request\\", answer.body);

          case 500:
            throw createError(name, registerConfirmationInternalServerError, \\"internal_server_error\\", answer.body);

          default:
            throw {
              status: 'unknown_status',
              error: {
                status: answer.status,
                body: answer.body
              }
            };
        }
      }

    });"
  `);
});
