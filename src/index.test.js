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
      ),
    ),
  ).toMatchInlineSnapshot(`
    "export type RegisterConfirmationDone = {
      status: \\"ok\\";
      answer: typed.Get<typeof registerConfirmationOk>;
    } | {
      status: \\"accepted\\";
      answer: typed.Get<typeof registerConfirmationAccepted>;
    };
    export type RegisterConfirmationFail = {
      status: \\"bad_request\\";
      error: typed.Get<typeof registerConfirmationBadRequest>;
    } | {
      status: \\"internal_server_error\\";
      error: typed.Get<typeof registerConfirmationInternalServerError>;
    } | GenericErrors;

    /*Send password recovery confirmation code to email*/
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
