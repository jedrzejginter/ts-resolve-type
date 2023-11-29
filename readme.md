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

```console
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

const resolved = await resolve("./src/index.ts", "MyType");

/*
const resolved = `type MyType = {
  1: number;
  2: number;
  3: number;
};`
*/
```
