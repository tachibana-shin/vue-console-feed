export function isPromise(obj: any): obj is Promise<unknown> {
  return typeof obj?.then === "function"
}