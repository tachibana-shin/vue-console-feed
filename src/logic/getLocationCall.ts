export function getLocationCall(deep = 3): string | null {
  const mess = new Error().stack?.toString().split("\n", deep)[deep - 1]

  if (!mess) return null

  const isAt = mess.startsWith("    at")

  if (isAt) return mess.slice(7)

  return mess.slice(mess.lastIndexOf("(") + 1, -1)
}
