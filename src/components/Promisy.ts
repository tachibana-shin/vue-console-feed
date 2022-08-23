// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Promisy<T extends (...args: any) => any> = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: T extends (...args: infer R) => any ? R : unknown
) => Promise<ReturnType<T>>
