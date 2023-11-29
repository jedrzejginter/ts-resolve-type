# ts-resolve-type

## Requirements

- Node 16 or higher
- TypeScript 5 or higher
  - `strict: true` in `tsconfig.json`

## Known limitations

- The type has to be `export`'ed
  - Most probably it's because TypeScript checker ignores types that are not used (??)
- Does not resolve `enum`

## Installation

```console
npm i -D ts-resolve-type typescript
```

## Usage

```ts
// src/index.ts
type Keys = 1 | 2 | 3;

export type InputType = {
  [K in Keys]: number;
};
```

### CLI

Find `InputType` in `src/index.ts` file and get the output type:

```console
npx ts-resolve-type src/index.ts InputType
```

Outputs

```ts
type InputType = {
  1: number;
  2: number;
  3: number;
};
```

### Node.js

```ts
import { resolve } from "ts-resolve-type";

const resolved = await resolve("./src/index.ts", "InputType");

/*
const resolved = `type InputType = {
  1: number;
  2: number;
  3: number;
};`
*/
```
