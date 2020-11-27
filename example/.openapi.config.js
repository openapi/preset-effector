module.exports = {
  file:
    'https://raw.githubusercontent.com/accesso-app/backend/master/api-public/openapi.yaml',
  presets: [
    [
      require.resolve('../'),
      {
        effectorImport: 'effector-root',
        requestName: 'fetchFx',
        requestPath: '../lib/fetch',
      },
    ],
  ],
  outputDir: `${__dirname}/api`,
  mode: 'dev',
  templateFileNameCode: 'index.ts',
};
