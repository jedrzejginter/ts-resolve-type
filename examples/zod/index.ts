import { z } from "zod";

const obj = z.object({
  foo: z.number().nullable(),
  baz: z.literal("hey").optional(),
  bar: z.discriminatedUnion("type", [
    z.object({ type: z.literal("one"), bar: z.boolean() }),
    z.object({ type: z.literal("two"), bar: z.boolean() }),
  ]),
});

export type InputType = z.infer<typeof obj>;
