import { getValue } from "./getValue"
import { TypedArray } from "./isTypedArray"

/*
BYTES_PER_ELEMENT: 1
constructor: ƒ Uint8Array()
buffer: (...)
byteLength: (...)
byteOffset: (...)
length: (...)
Symbol(Symbol.toStringTag): undefined
*/
export const keys = [
  // "BYTES_PER_ELEMENT",
  "buffer",
  "byteLength",
  "byteOffset",
  "length",
  Symbol.toStringTag
]
export function getOwnDescriptorsTypedArray(typed: TypedArray) {
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
