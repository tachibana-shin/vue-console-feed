import { getObjectName } from "./getObjectName"

export function isCollection(
  data: object
): data is
  | Map<unknown, unknown>
  | WeakMap<object, unknown>
  | Set<unknown>
  | WeakSet<object> {
  const type = getObjectName(data)

  return (
    data !== null &&
    typeof data === "object" &&
    // なんで？わかない。ぼくわかない。
    Object.getPrototypeOf(data) === data.constructor?.prototype &&
    (type === "Map" ||
      type === "WeakMap" ||
      type === "Set" ||
      type === "WeakSet")
  )
}
