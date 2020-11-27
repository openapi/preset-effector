const { compileTemplate } = require('./template');

test('should replace all markers', () => {
  const SOURCE = `
//#region {{METHOD_NAME}}
{{METHOD}}
//#endregion {{METHOD_NAME}}
`;

  expect(
    compileTemplate(SOURCE, {
      METHOD_NAME: 'exampleName',
      METHOD: `just example of content`,
    }),
  ).toMatchInlineSnapshot(`
    "
    //#region exampleName
    just example of content
    //#endregion exampleName
    "
  `);
});
