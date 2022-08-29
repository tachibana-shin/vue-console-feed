import { getObjectName } from "./getObjectName"
import { getValue } from "./getValue"

const keys = ["size"]
export function getOwnDescriptorsCollection(
  collection:
    | Map<unknown, unknown>
    | WeakMap<object, unknown>
    | Set<unknown>
    | WeakSet<object>
) {
  const des: Record<string, PropertyDescriptor> = {}

  const isFreeser = getObjectName(collection).startsWith("Weak")

  keys.forEach((name) => {
    if (isFreeser && name === "size") return

    // ([name, meta])
    const value = getValue(collection, name, collection)
    const enumerable = false

    if (typeof value !== "function")
      des[name.toString()] = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value: (collection as unknown as any)[name],
        enumerable
      }
  })

  return des
}
