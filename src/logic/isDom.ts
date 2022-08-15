export function isDom(el: any): el is Node {
  try {
    if (el instanceof Node) return el.nodeName !== undefined

    return false
  } catch {
    return false
  }
}
