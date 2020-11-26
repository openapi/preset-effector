module.exports = {
  file:
    'https://raw.githubusercontent.com/accesso-app/backend/master/api-public/openapi.yaml',
  presets: [require.resolve('../')],
  outputDir: `${__dirname}/api`,
  mode: 'dev',
  templateFileNameCode: 'index.ts',
};
