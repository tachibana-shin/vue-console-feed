// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isRegExp(obj: any): obj is RegExp {
  return obj instanceof RegExp
}
