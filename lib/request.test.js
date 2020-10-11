const { renderRequest } = require('./request');

test('should generate effect', () => {
  expect(
    renderRequest(
      {
        name: 'accessRecoverySendEmail',
        method: 'POST',
        path: '/access-recovery/send-email',
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
  ).toMatchInlineSnapshot(`
    "const accessRecoverySendEmailOk = typed.undef;
    const accessRecoverySendEmailAccepted = typed.object({
      error: type.union('invalid_email', 'invalid_password'),
    });
    const accessRecoverySendEmailDone = typed.union(
      accessRecoverySendEmailOk,
      accessRecoverySendEmailAccepted,
    )
    export type AccessRecoverySendEmailDone =
      | {
          status: 'ok';
          // Password changed successfully
          answer: typed.Get<typeof accessRecoverySendEmailOk>;
        }
      | {
          status: 'accepted';
          // Reset code or password is invalid
          answer: typed.Get<typeof accessRecoverySendEmailAccepted>;
        }
      | GenericErrors;
    // Send password recovery confirmation code to email
    export const accessRecoverySendEmailFx = createEffect<AccessRecoverySendEmail, AccessRecoverySendEmailDone, AccessRecoverySendEmailFail>({
      async handler() {
        const name = 'accessRecoverySendEmail.body'
        const answer = await requestFx({
          path: '/access-recovery/send-email',
          method: 'POST',
        })
        switch (answer.status) {
          case 200:
            return {
              status: 'ok',
              answer: parseWith(name, accessRecoverySendEmailOk, answer.body),
            };
          case 202:
            return {
              status: 'accepted',
              answer: parseWith(name, accessRecoverySendEmailAccepted, answer.body),
            };
          case 400:
            return {
              status: 'bad_request',
              answer: parseWith(name, accessRecoverySendEmailBadRequest, answer.body),
            };
          case 500:
            throwWith(
              name,
              accessRecoverySendEmailInternalServerError,
              'internal_server_error',
              answer.body,
            );
          default:
            throw {
              status: 'unknown_status',
              error: { status: answer.status, body: answer.body },
            };
        }
      }
    })"
  `);
});
