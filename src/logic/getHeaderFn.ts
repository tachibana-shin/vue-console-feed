const r = /(?:^async(?:\s+function\s*)?\s*\*?\s*)|(?:^(?:function\s*)?\*?\s*)/
// 52
const rStarSpaces = /^\*\s*/
const rCommaSpaces = /,\s*/g
const rSpaces = /\s+/g

export enum TypesFn {
  fn = 0,
  arrowFn = 1,
  propFn = 2
}

export function getHeaderFn(code: string) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const prefix = r.exec(code)![0]

  const indexSp = code.indexOf("{")
  // eslint-disable-next-line functional/no-let
  let indexArrow: number
  const endHeader =
    indexSp === -1 ? (indexArrow = (code.indexOf("=>") >>> 0) + 2) : indexSp

  const header = code.slice(prefix.length, endHeader)

  const indexSlashOpen = header.indexOf("(")
  const indexSlashClose = header.indexOf(")")

  const isAsync = prefix.startsWith("async")
  const isStar = prefix.includes("*")
  const name = header.slice(0, indexSlashOpen).replace(rStarSpaces, "* ")
  const args = header
    .slice(name.length, indexSlashClose + 1)
    .replace(rCommaSpaces, ", ")
  const typeFn = prefix.includes("function")
    ? TypesFn.fn
    : header.includes("=>")
    ? TypesFn.arrowFn
    : TypesFn.propFn

  // eslint-disable-next-line functional/no-let
  let content: string | undefined
  if (typeFn === TypesFn.arrowFn) {
    if (indexSp > -1) {
      content = code
        .slice(indexSp, (code.lastIndexOf("}") >>> 0) + 1)
        .replace(rSpaces, " ")
    } else {
      content = code
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        .slice(indexArrow + 1, (code.lastIndexOf("}") >>> 0) + 1)
        .replace(rSpaces, " ")
    }

    if (content.length > 52) content = undefined
  }

  return { name, args, content, isAsync, isStar, typeFn }
}
