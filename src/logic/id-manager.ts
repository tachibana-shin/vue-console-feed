const store = new Map<unknown, string>()

export function get(data: unknown): string {
  const inStore = store.get(data)

  if (inStore) return inStore

  const newKey = Math.random().toString(36)

  store.set(data, newKey)

  return newKey
}
export function clear(): void {
  store.clear()
}
