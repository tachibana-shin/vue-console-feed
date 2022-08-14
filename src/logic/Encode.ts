/* eslint-disable @typescript-eslint/ban-types */
// eslint-disable-next-line @typescript-eslint/no-namespace
namespace Data {
  export interface String {
    "@t": "string"
    "@value": string
  }
  export interface Number {
    "@t": "number"
    "@value": string
  }
  export interface BigInt {
    "@t": "bint"
    "@value": string
  }
  export interface Symbol {
    "@t": "symbol"
    "@value": string
  }
  export interface Nill {
    "@t": "nill"
    "@value": "null" | "undefined"
  }
  export interface Function {
    "@t": "function"
    "@name": string
    "@code": string
    "@real": objReal | Link
  }
  //=============
  export interface Collection extends Omit<Record, "@t" | "@de"> {
    "@t": "collection"
    "@name": "map" | "weakmap" | "set" | "weakset"
    "@size": number | null
    "@entries": unknown
  }
  //==============
  export interface RegExp extends Omit<Record, "@t" | "@de"> {
    "@t": "regexp"
    "@flags": string
    "@source": string
  }
  export interface GetSetter {
    "@t": "gs"
    "@value": unknown
    "@at": Partial<{
      [name in "get" | "set"]: Function
    }>
  }
  export interface objReal {
    [name: string | symbol | number]: {
      "@hidden": boolean
      "@value":
        | GetSetter
        | String
        | Number
        | BigInt
        | Symbol
        | Function
        | Collection
        | RegExp
        | Record
        | Nill
        // | Link
        | Error
        | Array
    }
  }
  export interface Link {
    "@t": "link"
    "@type": "object" | "function"
    "@link": string
    "@name": string | null
  }
  export interface Record {
    "@t": "object"
    "@name": string | null
    "@real": objReal | Link
    "@des"?: DataPreview.objReal
  }
  export interface Error {
    "@t": "error"
    "@name": string
    "@stack": string
    "@real": objReal
  }
  export interface Array {
    "@t": "array"
    "@size": number
    "@real": objReal & {
      length: {
        // TODO:いみわかない！
        "@hidden": boolean
        "@value": Number
      }
    }
  }
}

// ============= link object ==============
const linkStore = new Map<string, object>()
function createLinkObject(obj: object): Data.Link {
  const name =
    typeof obj === "function" ? obj.name : obj?.constructor.name ?? null

  for (const [link, tObj] of linkStore) {
    if (tObj === obj) {
      return {
        "@t": "link",
        "@type": typeof obj as "object" | "function",
        "@link": link,
        "@name": name
        // '@link':
      }
    }
  }

  const uid = Math.random().toString(34)

  linkStore.set(uid, obj)

  return {
    "@t": "link",
    "@type": typeof obj as "object" | "function",
    "@link": uid,
    "@name": name
  }
}
function readLinkObject(link: Data.Link) {
  const obj = linkStore.get(link["@link"])
  console.log(obj)
  return Encode(obj)
}
function callFnLink(link: Data.Link) {
  const fn = linkStore.get(link["@link"])

  if (typeof fn !== "function")
    return {
      "@t": "error",
      "@value": "not found"
    }

  return Encode(fn())
}
// ==========================================
function Encode(
  data: unknown,
  first = false,
  linkReal = false
):
  | Data.String
  | Data.Number
  | Data.BigInt
  | Data.Symbol
  | Data.Function
  | Data.Collection
  | Data.RegExp
  | Data.Nill
  | Data.Record
  | Data.Error
  | Data.Array {
  if (data instanceof Error) {
    const meta: Data.Error = {
      "@t": "error",
      "@name": data.name,
      "@stack": data.stack ?? "",
      "@real": encodeObject(data)
    }
    return meta
  }

  switch (typeof data) {
    case "string": {
      const meta: Data.String = {
        "@t": "string",
        "@value": data
      }
      return meta
    }
    case "number":
    case "boolean": {
      const meta: Data.Number = {
        "@t": "number",
        "@value": data.toString()
      }
      return meta
    }
    case "bigint": {
      const meta: Data.BigInt = {
        "@t": "bint",
        "@value": data.toString() + "n"
      }
      return meta
    }
    case "symbol": {
      const meta: Data.Symbol = {
        "@t": "symbol",
        "@value": data.toString()
      }
      return meta
    }
    case "undefined": {
      const meta: Data.Nill = {
        "@t": "nill",
        "@value": "undefined"
      }
      return meta
    }
    case "function": {
      const code = data + ""
      const name = code.slice(
        code.startsWith("function") ? 8 : 0,
        code.indexOf("{") >>> 0
      )
      const meta: Data.Function = {
        "@t": "function",
        "@code": first ? data.toString() : "",
        "@name": name,
        "@real": linkReal ? createLinkObject(data) : encodeObject(data, data)
      }
      return meta
    }
    case "object": {
      if (data === null) {
        const meta: Data.Nill = {
          "@t": "nill",
          "@value": "null"
        }
        return meta
      }

      if (data instanceof RegExp) {
        const meta: Data.RegExp = {
          "@t": "regexp",
          "@name": data + "",
          "@flags": data.flags,
          "@source": data.source,
          // わかない。ぜんぜんわかない！
          "@real": encodeObject(data, data)
        }
        return meta
      }

      if (data instanceof Array) {
        const meta: Data.Array = {
          "@t": "array",
          "@size": data.length,
          "@real": encodeObject(data, data) as ReturnType<
            typeof encodeObject
          > & {
            length: {
              "@hidden": boolean
              "@value": Data.Number
            }
          }
        }

        return meta
      }

      if (isCollection(data)) {
        const meta: Data.Collection = {
          "@t": "collection",
          "@name": toString.call(data).slice(8, -1) as Data.Collection["@name"],
          "@size": (data as Set<unknown>).size ?? null,
          "@entries": Array.from(
            (data as unknown as Map<unknown, unknown>).entries?.() ?? []
          ).map(([key, val]) => [Encode(key), Encode(val)]),
          "@real": {
            size: {
              "@hidden": true,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              "@value": Encode((data as unknown as any).size)
            },
            // わかない。ぜんぜんわかない！
            ...encodeObject(data, data)
          }
        }
        return meta
      }

      // getsyoubi no tawata
      const meta: Data.Record = {
        "@t": "object",
        "@name": data.constructor.name,
        // わかない。ぜんぜんわかない！
        "@real": linkReal ? createLinkObject(data) : encodeObject(data, data),
        "@des": createPreviewObject(data)
      }
      return meta
    }
    // undefined, object, function
  }
}

function getOwnDescriptorsIn(obj: object) {
  const des: Record<string, PropertyDescriptor> = {}
  for (const name in obj) {
    des[name] = {
      value: getValue(obj, name, obj)
    }
  }
  return des
}
function getOwnDescriptorsRegExp(reg: RegExp) {
  const des: Record<string, PropertyDescriptor> = {}

  const proto = Object.getPrototypeOf(/a/)

  Object.entries(Object.getOwnPropertyDescriptors(proto)).forEach(
    ([name, meta]) => {
      const { value } = meta
      if (name === "lastIndex") return

      if (typeof value !== "function")
        des[name] = {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value: (reg as unknown as any)[name]
        }
    }
  )

  return des
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DataPreview {
  export type Record = Pick<Data.Record, "@t" | "@name">
  export type Error = Pick<Data.Error, "@t" | "@name" | "@stack">
  export type RegExp = Pick<Data.RegExp, "@t" | "@name">
  export type Collection = Pick<Data.Collection, "@t" | "@name" | "@size">
  export type Array = Pick<Data.Array, "@t" | "@size">
  export type Function = Pick<Data.Function, "@t" | "@name">

  export interface objReal {
    [name: string]: {
      "@hidden": boolean
      "@value":
        | Record
        | Error
        | RegExp
        | Collection
        | Array
        // eslint-disable-next-line @typescript-eslint/ban-types
        | Function
        | Data.String
        | Data.Number
        | Data.BigInt
        | Data.Symbol
        | Data.Nill
    }
  }
}
/**
 * @description show prototype public
 */
function createPreviewObject(data: object): DataPreview.objReal {
  const publics = Object.keys(data)
  const meta = Object.fromEntries(
    Object.entries(getOwnDescriptorsIn(data)).map(
      ([name, meta]): [string, DataPreview.objReal[""]] => {
        const { value } = meta
        if (value instanceof Error) {
          return [
            name,
            {
              "@hidden": publics.includes(name) === false,
              "@value": {
                "@t": "error",
                "@name": value.name,
                "@stack":
                  value.stack?.split("\n", 3).slice(0, 3).join("\n") ?? ""
              }
            }
          ]
        }
        if (value instanceof RegExp) {
          return [
            name,
            /* object */ {
              "@hidden": publics.includes(name) === false,
              "@value": {
                "@t": "regexp",
                "@name": value + ""
              }
            }
          ]
        }
        if (isCollection(value)) {
          return [
            name,
            /* object */ {
              "@hidden": publics.includes(name) === false,
              "@value": {
                "@t": "collection",
                "@name": toString
                  .call(value)
                  .slice(8, -1) as Data.Collection["@name"],
                "@size": (value as Set<unknown>).size ?? null
              }
            }
          ]
        }
        if (value instanceof Array) {
          return [
            name,
            /* object */ {
              "@hidden": publics.includes(name) === false,
              "@value": {
                "@t": "array",
                "@size": value.length
              }
            }
          ]
        }

        if (value !== null && typeof value === "object") {
          return [
            name,
            /* object */ {
              "@hidden": publics.includes(name) === false,
              "@value": {
                "@t": "object",
                "@name": value.constructor.name
              }
            }
          ]
        }
        if (typeof value === "function") {
          return [
            name,
            {
              "@hidden": publics.includes(name) === false,
              "@value": {
                "@t": "function",
                "@name": ""
              }
            }
          ]
        }

        return [
          name,
          {
            "@hidden": publics.includes(name) === false,
            "@value": Encode(value, false)
          }
        ]
      }
    )
  )

  return meta
}
function encodeObject(
  data: object | Function | RegExp,
  receiver = data,
  proto: object | Function = Object.getPrototypeOf(data)
): Data.objReal {
  console.log("encode object")
  const publics = Object.keys(data)
  const meta = Object.fromEntries(
    Object.entries(
      Object.assign(
        getOwnDescriptorsIn(data),
        Object.getOwnPropertyDescriptors(data),
        data instanceof RegExp ? getOwnDescriptorsRegExp(data) : undefined
      )
    ).map(([name, meta]): [string, Data.objReal[""]] => {
      const { value } = meta
      if ("get" in meta || "set" in meta) {
        const at: Partial<Record<"get" | "set", Data.Function>> = {}
        if (meta.get) at.get = Encode(meta.get) as Data.Function
        if (meta.set) at.set = Encode(meta.set) as Data.Function
        return [
          name,
          {
            "@hidden": publics.includes(name) === false,
            "@value": {
              "@t": "gs",
              "@value": createLinkObject(() => getValue(data, name, receiver)), //meta.get?.(),
              "@at": at
            }
          }
        ]
      }
      if (
        value !== null &&
        typeof value === "object" &&
        !(value instanceof RegExp) &&
        !isCollection(value) &&
        !(value instanceof Error) &&
        !(value instanceof Array)
      ) {
        return [
          name,
          {
            "@hidden": publics.includes(name) === false,
            "@value": Encode(value, false, true) //createLinkObject(value),
          }
        ]
      }
      if (typeof value === "function") {
        return [
          name,
          {
            "@hidden": publics.includes(name) === false,
            "@value": Encode(value, false, true) // createLinkObject(value),
          }
        ]
      }

      return [
        name,
        {
          "@hidden": publics.includes(name) === false,
          "@value": Encode(value, false)
        }
      ]
    })
  )

  return Object.assign(meta, {
    "[[Prototype]]": {
      "@hidden": true,
      "@value": proto
        ? Encode(proto, false, true) /* createLinkObject(proto) */
        : Encode(proto, false)
    }
  })
}
const toString = Object.prototype.toString
function isCollection(
  data: object
): data is
  | Map<unknown, unknown>
  | WeakMap<object, unknown>
  | Set<unknown>
  | WeakSet<object> {
  const type = toString.call(data).slice(8, -1)

  return (
    data !== null &&
    typeof data === "object" &&
    // なんで？わかない。ぼくわかない。
    Object.getPrototypeOf(data) === data.constructor.prototype &&
    (type === "Map" ||
      type === "WeakMap" ||
      type === "Set" ||
      type === "WeakSet")
  )
}
function getValue(data: object, name: string, receiver: object) {
  try {
    return Reflect.get(data, name, receiver)
  } catch (e) {
    return e
  }
}

console.time()
// console.log(JSON.stringify(Encode(global)))
console.timeEnd()
export { Encode }
export { readLinkObject }
export { callFnLink }
export type { Data }
/// ===================== Decode =====================
