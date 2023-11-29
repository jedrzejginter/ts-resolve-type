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
    // This temporary file will be always created in the same directory
    // as the source file.
    writeFileSync(
      tmpPath,
      `
      import { ${typeAlias} } from './${parse(file).name}';

      type __expand__<T> = 
        T extends Promise<infer R> 
          ? Promise<__expand__<R>>
          : T extends (...args: infer Args) => infer RetVal
            ? (...args: __expand__<Args>) => __expand__<RetVal>
            : T extends [infer El, ...infer Tail] 
              ? [__expand__<El>, ...__expand__<Tail>]
              : T extends Array<infer El> 
                ? Array<__expand__<El>>
                : T extends Record<string, any>
                    ? { [K in keyof T]: __expand__<T[K]> }
                    : T;

      export type ___output___ = __expand__<${typeAlias}>

    `,
      "utf-8"
    );

    // relative to your root
    const program: ts.Program = ts.createProgram([tmpPath], {
      // Required because it adds '?' to all keys
      // in non-strict mode.
      //
      // FIXME: We should use user-defined config instead
      // to delegate responsibility of creating correct type
      // to user instead of use trying to force some options to be
      // enabled.
      strict: true,
    });
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
        void 0,
        // IMPORTANT: This tells TypeScript not to truncate the type
        // if it's a big one.
        // NOTE: Not sure if 'ts.TypeFormatFlags.InTypeAlias' is needed here?
        ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.InTypeAlias
      )
    );
  } catch (err) {
    throw err;
  } finally {
    // Make sure to always clean up
    rmSync(tmpPath, { force: true, recursive: true });
  }
}
