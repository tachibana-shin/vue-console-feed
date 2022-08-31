export function getLocationCall(deep = 3): string | undefined {
  const mess = new Error().stack?.toString().split("\n", deep)[deep - 1]

  if (!mess) return

  if (mess.endsWith(")"))
    return mess
      .slice(mess.lastIndexOf("(") + 1, -1)
      .replace(/t=\d+/, "")
      .replace(/\?:/, ":")
  return mess.slice(7)
}
