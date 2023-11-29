type Keys = 1 | 2 | 3;

type A = {
  B: 1;
  C: 2;
};

type Ret = {
  [k in Keys]: string | boolean;
};

export type MyType = {
  [K in Keys]: number;
} & {
  func: (a: A | Ret) => Ret;
  asyncfunc: (a: A) => Promise<Ret>;
  funcis: (b: number) => b is 3;
  arr: Ret[];
};

export type MyType2 = {
  foo?: number;
  bar: number | undefined;
};
