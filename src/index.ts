import ts from "typescript";

import { dirname, join, parse } from "node:path";
import { rmSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";

export async function resolve(
  file: string,
  typeAlias: string
): Promise<string> {
  // FIXME: Use in-memory "file"
  const tmpPath: string = join(
    dirname(file),
    randomBytes(16).toString("hex") + parse(file).base
  );

  try {
    writeFileSync(
      tmpPath,
      `
      import { ${typeAlias} } from './${parse(file).name}';

      type ExpandRecursively<T> = T extends object
        ? T extends infer O
          ? { [K in keyof O]: ExpandRecursively<O[K]>; }
          : never
        : T;

      export type ___output___ = ExpandRecursively<${typeAlias}>

    `,
      "utf-8"
    );

    // relative to your root
    const program: ts.Program = ts.createProgram([tmpPath], {});
    const checker: ts.TypeChecker = program.getTypeChecker();

    const sourceFile: ts.SourceFile | undefined =
      program.getSourceFile(tmpPath);

    let node: ts.Node | null = null;

    sourceFile?.forEachChild((childNode) => {
      if (node) {
        return;
      }

      if (
        ts.isTypeAliasDeclaration(childNode) &&
        childNode.name.getText() === "___output___"
      ) {
        node = childNode;
      }
    });

    if (!node) {
      throw new Error(
        `Type named "${typeAlias}" not found in the "${file}" file`
      );
    }

    const type: ts.Type = checker.getTypeAtLocation(node);

    return (
      `type ${typeAlias} = ` +
      checker.typeToString(
        type,
        undefined,
        // IMPORTANT: This tells TypeScript not to truncate the type
        // if it's a big one.
        ts.TypeFormatFlags.NoTruncation
      )
    );
  } catch (e) {
    throw e;
  } finally {
    rmSync(tmpPath, { force: true, recursive: true });
  }
}
