import type { DataPreview } from "./Encode"
import { createPreviewValue, Encode } from "./Encode"
import { entries } from "./entries"
import { getLocationCall } from "./getLocationCall"
import { getOwnDescriptorsBuffer } from "./getOwnDescriptorsBuffer"
import { getOwnDescriptorsCollection } from "./getOwnDescriptorsCollection"
import { getOwnDescriptorsDataView } from "./getOwnDescriptorsDataView"
import { getOwnDescriptorsIn } from "./getOwnDescriptorsIn"
import { getOwnDescriptorsRegExp } from "./getOwnDescriptorsRegExp"
import { getOwnDescriptorsTypedArray } from "./getOwnDescriptorsTypedArray"
import { isArrayEmpty } from "./isArrayEmpty"
import { isBuffer } from "./isBuffer"
import { isCollection } from "./isCollection"
import { isDataView } from "./isDataView"
import { isRegExp } from "./isRegExp"
import { isTypedArray } from "./isTypedArray"

function getExtendsPropertyDescriptors(
  data: unknown
): Record<string, PropertyDescriptor> | undefined {
  if (data === null || typeof data !== "object") return

  if (isBuffer(data)) return getOwnDescriptorsBuffer(data)
  if (isCollection(data)) return getOwnDescriptorsCollection(data)
  if (isDataView(data)) return getOwnDescriptorsDataView(data)
  if (isRegExp(data)) return getOwnDescriptorsRegExp(data)
  if (isTypedArray(data)) return getOwnDescriptorsTypedArray(data)

  return undefined
}
function getDescriptors<T extends object>(data: T) {
  return Object.assign(
    getOwnDescriptorsIn(data),
    Object.getOwnPropertyDescriptors(data),
    getExtendsPropertyDescriptors(data)
    //   extendsPropertyDescriptors //data instanceof RegExp ? getOwnDescriptorsRegExp(data) : undefined
  )
}

export function Table<T extends object>(
  data: T,
  deepLink?: false | number,
  noCollapse?: boolean
): {
  readonly table: Record<
    string,
    Record<string, DataPreview.objReal[""]["@value"]>
  >
  readonly cols: string[]
  readonly "@location"?: string
  readonly "@collapse"?: ReturnType<typeof Encode>
} {
  const table: Record<
    string,
    Record<string, DataPreview.objReal[""]["@value"]>
  > = {}
  const nameCols = new Set<string>()

  entries(getDescriptors(data)).forEach(([name, meta]) => {
    if (import.meta.env.NODE_ENV !== "production") console.log({ name, meta })
    name = name.toString()
    const { value } = meta

    //  table[name] = meta.value
    // eslint-disable-next-line functional/no-let
    let isArray: undefined | boolean
    if (
      value !== null &&
      typeof value === "object" &&
      (!(isArray = Array.isArray(value)) || !isArrayEmpty({ arr: value }))
    ) {
      const row = (table[name] = {}) as typeof table[""]
      // meta.value
      entries(getDescriptors(value)).forEach(([propName, propMeta]) => {
        if (isArray && propName === "length") return

        propName = propName.toString()

        nameCols.add(propName)

        row[propName] = createPreviewValue(propMeta.value)
        // nameCols.add(propName.toString())
      })
    } else {
      nameCols.add("Values")
      table[name] = {
        Values: createPreviewValue(value)
      }
    }
  })

  return {
    table,
    cols: Array.from(nameCols.values()),
    "@location": deepLink === false ? undefined : getLocationCall(deepLink),
    "@collapse": noCollapse ? undefined : Encode(data, false)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isTable(data: any): data is ReturnType<typeof Table> {
  return typeof data?.table === "object"
}
