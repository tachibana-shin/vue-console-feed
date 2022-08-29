import { getValue } from "./getValue"

const keys = ["byteLength"]
export function getOwnDescriptorsBuffer(typed: ArrayBuffer) {
  const des: Record<string, PropertyDescriptor> = {}

  keys.forEach((name) => {
    // ([name, meta])
    const value = getValue(typed, name, typed)
    const enumerable = false

    if (typeof value !== "function")
      des[name.toString()] = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value: (typed as unknown as any)[name],
        enumerable
      }
  })

  return des
}
