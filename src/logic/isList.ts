export function isList(obj: any): obj is Array<unknown> | NodeList {
  if (Array.isArray(obj)) return true

  return obj instanceof NodeList
}
