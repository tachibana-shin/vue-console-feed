export function getLocationCall(deep = 3): string | undefined {
  deep += 2

  const mess = new Error().stack?.toString().split(" at ", deep)[deep - 1]

  if (!mess) return

  if (mess.includes(")"))
    return mess
      .slice(mess.lastIndexOf("(") + 1, mess.lastIndexOf(")"))
      .replace(/t=\d+/, "")
      .replace(/\?:/, ":")

  return mess.slice(7)
}
