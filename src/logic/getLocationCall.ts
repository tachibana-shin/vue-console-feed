export function getLocationCall(deep = 0): string | undefined {
  deep += 5

  const lines = new Error().stack?.toString().split(" at ", deep)

  if (!lines) return 

  const mess = lines[deep - 1] ?? lines[lines.length - 1]

  if (!mess) return

  if (mess.includes(")")) {
    const basename = mess.slice(
      mess.lastIndexOf("(") + 1,
      mess.lastIndexOf(")")
    )
    try {
      const url = new URL(basename)

      url.searchParams.delete("t")

      return url.href
    } catch {
      return basename
    }
  }

  return mess.slice(7)
}
