export function formatRelativeLink(value: string): string {
  return value
    .slice(value.lastIndexOf("/") + 1, -1)
    .replace(/t=\d+/, "")
    .replace(/\?:/, ":")
}

const rUrl = /(?:[^\s]+):\/\/[^\s]+/gi

export function parseLink(
  text: string,
  options?: {
    disableClick?: boolean
    minifyLink?: boolean
    classes?: string
  }
): string {
  const tag = options?.disableClick ? "span" : "a"
  const minifyLink = options?.minifyLink
  const classes = options?.classes ?? ""

  text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;") // block XSS

  text = text.replace(rUrl, (url) => {
    const text = minifyLink ? formatRelativeLink(url) : url

    return `<${tag} ${
      tag === "a" ? `href=${JSON.stringify(url)} target="_blank" ` : ""
    }class="console-link ${classes}">${text}</${tag}>`
  })

  return text
}
