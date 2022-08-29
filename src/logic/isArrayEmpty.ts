export function isArrayEmpty({ arr }: { arr: Array<unknown> }): boolean {
  // eslint-disable-next-line no-unreachable-loop
  for (const name in arr) {
    if (Number.isNaN(+name)) return true
    return false
  }

  return true
}
