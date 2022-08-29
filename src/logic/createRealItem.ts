export function createRealItem<T>(value: T, hidden = false) {
  return {
    "@hidden": hidden,
    "@value": value
  }
}
