# @sergeysova/swagger-to-js-preset

## Usage

#### Install swagger-to-js and preset

```shell
yarn add -D swagger-to-js@^0.2.0 @sergeysova/swagger-to-js-preset
```

#### Create config

```js
// swagger-to-js.config.js
module.exports = {
  file: 'path to local or remote swagger v2 or v3 spec',
  outputDir: 'relative path to generated api directory',
  presets: ['@sergeysova/swagger-to-js-preset'],
};
```

#### Run generation

```shell
yarn swagger-to-js
# or
npx swagger-to-js
```

#### Review generated files

```shell
ls -la ./path-to-generated-api
```
