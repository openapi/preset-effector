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
