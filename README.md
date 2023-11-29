# ts-resolve-type

## Requirements

- Node 16 or higher
- TypeScript 5 or higher

## Installation

```console
npm i -D ts-resolve-type typescript
```

## Usage

```ts
// src/index.ts
type Keys = 1 | 2 | 3;

export type MyType = {
  [K in Keys]: number;
};
```

### CLI

```
npx ts-resolve-type src/index.ts MyType
```

Outputs

```ts
type MyType = {
  1: number;
  2: number;
  3: number;
};
```

### Node.js

```ts
import { resolve } from "ts-resolve-type";
// const { resolve } = require("ts-resolve-type");

const resolved = resolve("./src/index.ts", "MyType");

/*
const resolved = `type MyType = {
  1: number;
  2: number;
  3: number;
};`
*/
```
