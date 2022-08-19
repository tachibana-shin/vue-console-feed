import { getValue } from "./getValue"
import { isList } from "./isList"

export function getOwnDescriptorsIn<T extends object>(obj: T) {
  const des: Record<string, PropertyDescriptor> = {}

  const list = isList(obj)

  for (const name in obj) {
    if (list && typeof name === "string" && name !== "length") continue // skip array exm: entries(), values()
    des[name] = {
      value: getValue(obj, name, obj),
      enumerable: true
    }
  }
  return des
}
