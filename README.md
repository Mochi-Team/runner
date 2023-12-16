![Supported Version](https://img.shields.io/github/package-json/dependency-version/Mochi-Team/runner/dev/%40mochiapp/js/main)

# @mochiapp/runner

> A test runner used for Mochi modules.

## Installation

Using pnpm:

```bash
pnpm add -D @mochiapp/runner
```

Using npm:

```bash
npm install --save-dev @mochiapp/runner
```

Using yarn:

```bash
yarn add -D @mochiapp/runner
```

## Example

In a test file:

```js
import Source from '../src/source';
import runner from '@mochiapp/runner';

const source = runner(Source);

test('fetch filters', () => {
  return source.searchFilters().then((r) => {
    assert.equal(r.length, 1);
  });
});

// Rest of the tests...
```
