export function isArrayEmpty(arr: Array<unknown>): boolean {
  for (const name in arr) {
    if (Number.isNaN(+name)) return true
    return false
  }

  return true
}
