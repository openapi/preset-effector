# effector-openapi-preset

## Usage

#### Install openapi and preset

```shell
yarn add -D openapi@^1.0.0 effector-openapi-preset
```

#### Create config

```js
// openapi.config.js
module.exports = {
  file: 'path to local or remote swagger v2 or v3 spec',
  outputDir: 'relative path to generated api directory',
  presets: ['effector-openapi-preset'],
};
```

#### Options

```js
// openapi.config.js
module.exports = {
  file: 'path to local or remote swagger v2 or v3 spec',
  outputDir: 'relative path to generated api directory',
  presets: [
    [
      'effector-openapi-preset',
      {
        effectorImport: 'effector-root',
        requestName: 'fetchFx',
        requestPath: '../lib/fetch',
      },
    ],
  ],
};
```

- `effectorImport` (default `"effector"`) — what instance of the effector should be used
- `requestName` (default `"requestFx"`) — change base effect for the each request
- `requestPath` (default `"./request"`) — whether to import base request from

#### Run generation

```shell
yarn openapi
# or
npx openapi
```

#### Review generated files

```shell
ls -la ./path-to-generated-api
```
