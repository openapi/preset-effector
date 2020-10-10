const { execSync } = require('child_process');
const { readFileSync, writeFileSync } = require('fs');
const path = require('path');
const fs = require('fs');
const { sentenceCase } = require('change-case');

afterEach(() => {
  execSync('rm -rf ./TEST_API ./TEST_CONFIG.js');
});

describe('CLI', () => {
  const fixturesDir = path.join(__dirname, 'fixtures');
  const testCases = fs
    .readdirSync(fixturesDir)
    .filter((file) => file.endsWith('.js'))
    .sort();

  for (const caseFile of testCases) {
    const caseName = sentenceCase(`should ${caseFile.replace(/[tj]sx?/, '')}`);

    it(caseName, async () => {
      const fixturePath = path.join(fixturesDir, caseFile);
      const { cli, fileTypes, fileCode, configContent } = require(fixturePath);

      let command = `yarn swagger-to-js --output-dir ./TEST_API ${cli}`;

      if (configContent) {
        writeFileSync('./TEST_CONFIG.js', configContent);
        command += ` --config ./TEST_CONFIG.js`;
      }

      execSync(command);

      expect(execSync('ls ./TEST_API').toString()).toMatchSnapshot('files');

      if (fileTypes)
        expect(readFileSync(`./TEST_API/${fileTypes}`, 'utf8')).toMatchSnapshot(
          'types',
        );

      if (fileCode)
        expect(readFileSync(`./TEST_API/${fileCode}`, 'utf8')).toMatchSnapshot(
          'code',
        );
    });
  }
});
