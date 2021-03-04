module.exports = {
  file:
    // 'https://raw.githubusercontent.com/accesso-app/backend/master/api-internal/openapi.yaml',
    // 'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v3.0/petstore.yaml',
    'https://raw.githubusercontent.com/github/rest-api-description/main/descriptions/api.github.com/api.github.com.json',
  presets: [
    [
      require.resolve('../'),
      {
        effectorImport: 'effector-root',
        requestName: 'fetchFx',
        requestPath: '../lib/fetch',
        fileName: 'index.ts',
      },
    ],
  ],
  outputDir: `${__dirname}/api`,
};
