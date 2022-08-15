import { entries } from "./entries"

const proto = Object.getPrototypeOf(/a/)
export function getOwnDescriptorsRegExp(reg: RegExp) {
  const des: Record<string, PropertyDescriptor> = {}

  entries(Object.getOwnPropertyDescriptors(proto)).forEach(([name, meta]) => {
    const { value } = meta
    if (name === "lastIndex") return

    if (typeof value !== "function")
      des[name.toString()] = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value: (reg as unknown as any)[name]
      }
  })

  return des
}
