const { stringPathToLiteral } = require('./path-literal');

test('string without expressions', () => {
  expect(stringPathToLiteral('/hello')).toBeNull();
});

test('with one expression', () => {
  expect(stringPathToLiteral('/hello/{first}')).toEqual({
    expressions: ['first'],
    quasis: ['/hello/', ''],
  });
});

test('with two expressions', () => {
  expect(stringPathToLiteral('/hello/{first}/world/{second}')).toEqual({
    expressions: ['first', 'second'],
    quasis: ['/hello/', '/world/', ''],
  });
});

test('expression in the middle', () => {
  expect(stringPathToLiteral('/data/{expression}/tail')).toEqual({
    expressions: ['expression'],
    quasis: ['/data/', '/tail'],
  });
});

test('expression on the start', () => {
  expect(stringPathToLiteral('{expression}/tail')).toEqual({
    expressions: ['expression'],
    quasis: ['', '/tail'],
  });
});
