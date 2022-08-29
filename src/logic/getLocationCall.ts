export function getLocationCall(deep = 3): string | null {
  const mess = new Error().stack?.toString().split("\n", deep)[deep - 1]

  if (!mess) return null

  if (mess.endsWith(")"))
    return mess
      .slice(mess.lastIndexOf("(") + 1, -1)
      .replace(/t=\d+/, "")
      .replace(/\?:/, ":")
  return mess.slice(7)
}
