#!/usr/bin/env node

import { resolve } from "./index.js";

const [file, typeAlias] = process.argv.slice(2);

if (!file || !typeAlias) {
  throw new Error(`Usage: ts-resolve-type <file> <type_name>`);
}

resolve(file, typeAlias).then((resolved) => {
  console.log(resolved);
});
