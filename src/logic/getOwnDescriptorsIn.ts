import { getValue } from "./getValue"

export function getOwnDescriptorsIn(obj: object) {
  const des: Record<string, PropertyDescriptor> = {}
  for (const name in obj) {
    des[name] = {
      value: getValue(obj, name, obj),
      enumerable: true
    }
  }
  return des
}
