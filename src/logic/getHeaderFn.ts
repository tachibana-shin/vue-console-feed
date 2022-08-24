const r = /(?:^async(?:\s+function\s*)?\*?\s*)|(?:(?:function\s*)?\*?\s*)/
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
  const prefix = r.exec(code)![0]

  const indexSp = code.indexOf("{")
  let indexArrow
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
  const typeFn = prefix.startsWith("function")
    ? TypesFn.fn
    : header.includes("=>")
    ? TypesFn.arrowFn
    : TypesFn.propFn

  let content: string | undefined
  if (typeFn === TypesFn.arrowFn) {
    if (indexSp > -1) {
      content = code
        .slice(indexSp, (code.lastIndexOf("}") >>> 0) + 1)
        .replace(rSpaces, " ")
    } else {
      content = code
        .slice(indexSp, (code.lastIndexOf("}") >>> 0) + 1)
        .replace(rSpaces, " ")
    }

    if (content.length > 52) content = undefined
  }

  return { name, args, content, isAsync, isStar, typeFn }
}

// const a = async (v: string, vv: string, ...vvv: string[]) => {}
// const aa = (v: string, vv: string, ...vvv: string[]) => {}

// const b = async function name(params: string) {}
// const bb = function name(params: string) {}

// const c = async function* name(params: string) {}
// const cc = function* name(params: string) {}

// const d = async function* name() {}
// const dd = function* name() {}

// getHeaderFn(a + "")
// getHeaderFn(aa + "")
// getHeaderFn(b + "")
// getHeaderFn(bb + "")
// getHeaderFn(c + "")
// getHeaderFn(cc + "")
// getHeaderFn(d + "")
// getHeaderFn(dd + "")

// const a = { *as() {}, ac() {}, async *sas() {}, async sac() {} }

// getHeaderFn(a.as + "")
// getHeaderFn(a.ac + "")
// getHeaderFn(a.sas + "")
// getHeaderFn(a.sac + "")
