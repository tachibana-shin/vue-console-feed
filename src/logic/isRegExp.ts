export function isRegExp(obj: any): obj is RegExp {
  return obj instanceof RegExp
}