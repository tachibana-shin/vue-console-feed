const TEXT_NODE_MAX_INLINE_CHARS = 80

export function shouldInline(data: Node): boolean {
  return (
    data.childNodes.length === 0 ||
    (data.childNodes.length === 1 &&
      (!data.textContent ||
        (data.childNodes[0].nodeType === Node.TEXT_NODE &&
          data.textContent.length < TEXT_NODE_MAX_INLINE_CHARS)))
  )
}
