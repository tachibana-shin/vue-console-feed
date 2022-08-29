// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isPromise(obj: any): obj is Promise<unknown> {
  return typeof obj?.then === "function"
}
