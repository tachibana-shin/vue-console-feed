import { createPreviewValue } from "./Encode"
import { entries } from "./entries"
import { getOwnDescriptorsIn } from "./getOwnDescriptorsIn"

export function Table<T extends object>(data: T) {
  const table: Record<string, Record<string, unknown>> = {}
  const nameCols = new Set<string>()
  let hasValues = false

  entries(
    Object.assign(
      getOwnDescriptorsIn(data),
      Object.getOwnPropertyDescriptors(data)
      //   extendsPropertyDescriptors //data instanceof RegExp ? getOwnDescriptorsRegExp(data) : undefined
    )
  ).forEach(([name, meta]) => {
    name = name.toString()
    const { value } = meta

    //  table[name] = meta.value
    if (value !== null && typeof value === "object") {
      const row = (table[name] = {}) as typeof table[""]
      // meta.value
      entries(
        Object.assign(
          getOwnDescriptorsIn(value),
          Object.getOwnPropertyDescriptors(value)
        )
      ).forEach(([propName, propMeta]) => {
        propName = propName.toString()

        nameCols.add(propName)

        row[propName] = createPreviewValue(propMeta)
        // nameCols.add(propName.toString())
      })
    } else {
      if (!hasValues) hasValues = true
      // nameCols.add("Values")
      table[name] = {
        Values: createPreviewValue(value)
      }
    }
  })

  if (hasValues) nameCols.add("Values")

  return {
    table,
    cols: Array.from(nameCols.values())
  }
}
