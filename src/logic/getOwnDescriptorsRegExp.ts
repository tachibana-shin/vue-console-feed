import { entries } from "./entries"

const keys = entries(Object.getOwnPropertyDescriptors(RegExp.prototype))
export function getOwnDescriptorsRegExp(reg: RegExp) {
  const des: Record<string, PropertyDescriptor> = {}

  keys.forEach(([name, meta]) => {
    const { value, enumerable } = meta
    if (name === "lastIndex") return

    if (typeof value !== "function")
      des[name.toString()] = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value: (reg as unknown as any)[name],
        enumerable
      }
  })

  return des
}
