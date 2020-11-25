const { renderRequest } = require('./index');

test('render', () => {
  expect(renderRequest()).toMatchInlineSnapshot(`
    "/*Send password recovery confirmation code to email*/
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
