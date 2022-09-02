export function getLocationCall(deep = 0): string | undefined {
  deep += 5

  const mess = new Error().stack?.toString().split(" at ", deep)[deep - 1]

  if (!mess) return

  if (mess.includes(")")) {
    const basename = mess.slice(
      mess.lastIndexOf("(") + 1,
      mess.lastIndexOf(")")
    )
    try {
      const url = new URL(basename)

      url.searchParams.delete(t)

      return url.href
    } catch {
      return basename
    }
  }

  return mess.slice(7)
}
