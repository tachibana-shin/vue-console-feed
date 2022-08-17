/* eslint-disable @typescript-eslint/ban-types */
import { entries } from "./entries"
import { isList } from "./isList"
import { isDom } from "./isDom"
import { shouldInline } from "./shouldInline"
import { isCollection } from "./isCollection"
import { getOwnDescriptorsIn } from "./getOwnDescriptorsIn"
import { getOwnDescriptorsRegExp } from "./getOwnDescriptorsRegExp"
import { getOwnDescriptorsBuffer } from "./getOwnDescriptorsBuffer"
import { getValue } from "./getValue"
import { isPromise } from "./isPromise"
import { isTypedArray } from "./isTypedArray"
import { isBuffer } from "./isBuffer"
import { getOwnDescriptorsTypedArray } from "./getOwnDescriptorsTypedArray"
import { getObjectName } from "./getObjectName"
import { createRealItem } from "./createRealItem"
import { isDataView } from "./isDataView"
import { getOwnDescriptorsDataView } from "./getOwnDescriptorsDataView"

interface RealItem<T> {
  "@hidden": boolean
  "@value": T
}
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Data {
  export interface String {
    "@t": "string"
    "@first": boolean
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
    "@first": boolean
    "@code": string
    "@real": Link | null
  }
  //=============
  export interface Collection
    extends Omit<Record, "@t" | "@des" | "@first" | "@real"> {
    "@t": "collection"
    "@name": "map" | "weakmap" | "set" | "weakset"
    "@size": number | null
    "@entries": unknown
    "@real": Link
  }
  //==============
  export interface RegExp
    extends Omit<Record, "@t" | "@de" | "@real" | "@des"> {
    "@t": "regexp"
    "@flags": string
    "@source": string
    "@real": Link | null
  }
  export interface GetSetter {
    "@t": "gs"
    "@value": Link
    "@at": Partial<{
      [name in "get" | "set"]: Function
    }>
  }
  export interface objReal {
    [name: string]: RealItem<
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
      | Element
      | Promise
      | Date
      | TypedArray
      | Buffer
      | DataView
    >
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
    "@first": boolean
    "@real": objReal | Link
    "@des": {
      "@value": DataPreview.objReal
      "@lastKey": string
    } | null
  }
  export interface Error {
    "@t": "error"
    "@first": boolean
    "@stack": string // use
    "@real": Link | null // use
  }
  export interface Array extends Pick<Record, "@des"> {
    "@t": "array"
    "@size": number
    "@name": string | null
    "@first": boolean
    "@real": Link
  }
  export type ArrayReal = objReal & {
    // TODO:いみわかない！
    length: RealItem<Number>
  }
  export interface Element {
    "@t": "element"
    "@name": string
    "@first": boolean
    "@attrs"?: [string, string][]
    "@real": Link | null
    "@childs"?: string | null | Link
  }
  export interface Promise {
    "@t": "promise"
    "@first": boolean
    "@state": "pending" | "fulfilled" | "rejected"
    "@real": Link
    "@des": Exclude<Record["@des"], null>
  }
  export interface Date extends Pick<Record, "@des"> {
    "@t": "date"
    "@first": boolean
    "@value": string
    "@real": Link | null
  }
  export interface TypedArray extends Omit<Array, "@t"> {
    "@t": "typedarray"
    "@real": Link
  }
  export type TypedArrayReal = ArrayReal & {
    buffer: RealItem<Buffer>
    byteLength: RealItem<Number>
    byteOffset: RealItem<Number>
    [Symbol.toStringTag]: RealItem<String>
  }
  export interface Buffer extends Omit<Array, "@t" | "@des" | "@real"> {
    "@t": "buffer"
    // size is equal byteLength
    "@real": Link
  }
  export type BufferReal = objReal & {
    byteLength: RealItem<Number>
    "[[Int8Array]]": RealItem<TypedArray>
    "[[Uint8Array]]": RealItem<TypedArray>

    "[[Int16Array]]": RealItem<TypedArray>
    "[[Int32Array]]": RealItem<TypedArray>

    "[[ArrayBufferByteLength]]": RealItem<Number>
  }
  export interface DataView extends Omit<Array, "@t" | "@des" | "@name"> {
    "@t": "dataview"
    "@name": "DataView"
    "@real": Link
  }
  export type DataViewReal = ArrayReal & {
    buffer: RealItem<Buffer>
    byteLength: RealItem<Number>
    byteOffset: RealItem<Number>
  }
}

const nameByNodeType = {
  1: "ELEMENT_NODE",
  3: "TEXT_NODE",
  7: "PROCESSING_INSTRUCTION_NODE",
  8: "COMMENT_NODE",
  9: "DOCUMENT_NODE",
  10: "DOCUMENT_TYPE_NODE", // http://stackoverflow.com/questions/6088972/get-doctype-of-an-html-as-string-with-javascript
  11: "DOCUMENT_FRAGMENT_NODE"
}

// ============= link object ==============
const linkStore = new Map<string, object>()
function createLinkObject(obj: object): Data.Link {
  const name =
    typeof obj === "function" ? obj.name : obj?.constructor?.name ?? null

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
export function readLinkObject(link: Data.Link) {
  const obj = linkStore.get(link["@link"])

  console.log("readLink: ", { obj })

  return Encode(obj, false, false)
}
export function callFnLink(
  link: Data.Link
): ReturnType<typeof Encode> | Data.Error {
  const fn = linkStore.get(link["@link"])

  if (typeof fn !== "function")
    return {
      "@t": "error",
      "@first": false,
      "@stack": "Error: this memory freed.",
      "@real": null
    }

  return Encode(fn(), false, true)
}
export function _getListLink(
  link: Data.Link
): (ReturnType<typeof Encode> | Data.Error)[] {
  const obj = linkStore.get(link["@link"])

  if (obj === undefined || !("length" in obj))
    return [
      {
        "@t": "error",
        "@first": false,
        "@stack": "Error: this memory freed.",
        "@real": null
      }
    ]

  return Array.from(obj as ArrayLike<Node>).map((item) =>
    Encode(item, true, true)
  )
}
export function clearLinkStore() {
  linkStore.clear()
}
// ==========================================
export function Encode(
  data: unknown,
  first: boolean, // false,
  linkReal: boolean // false
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
  | Data.Array
  | Data.Element
  | Data.Promise
  | Data.Date
  | Data.TypedArray
  | Data.Buffer
  | Data.DataView {
  switch (typeof data) {
    case "string": {
      const meta: Data.String = {
        "@t": "string",
        "@first": first,
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
      if (linkReal) {
        const code = data + ""
        const name = code.slice(
          code.startsWith("function") ? 8 : 0,
          code.indexOf("{") >>> 0
        )
        const meta: Data.Function = {
          "@t": "function",
          "@code": first ? data.toString() : "",
          "@name": name,
          "@first": first,
          "@real": first ? null : createLinkObject(data)
        }
        return meta
      }

      return createFakeRecord(encodeObject(data))
    }
    case "object": {
      if (data === null) {
        const meta: Data.Nill = {
          "@t": "nill",
          "@value": "null"
        }
        return meta
      }

      if (data instanceof Error) {
        if (linkReal) {
          const meta: Data.Error = {
            "@t": "error",
            "@first": first,
            "@stack": data.stack ?? "",
            "@real": first ? null : createLinkObject(data)
          }
          return meta
        }

        return createFakeRecord(encodeObject(data))
      }

      if (data instanceof RegExp) {
        if (linkReal) {
          const meta: Data.RegExp = {
            "@t": "regexp",
            "@name": data + "",
            "@first": first,
            "@flags": data.flags,
            "@source": data.source,
            // わかない。ぜんぜんわかない！
            "@real": first ? null : createLinkObject(data) // encodeObject(data, getOwnDescriptorsRegExp(data))
          }
          return meta
        }

        return createFakeRecord(
          encodeObject(data, getOwnDescriptorsRegExp(data))
        )
      }

      if (data instanceof Date) {
        if (linkReal) {
          const meta: Data.Date = {
            "@t": "date",
            "@first": first,
            "@value": data.toString(),
            "@real": first ? null : createLinkObject(data), // encodeObject(data)
            "@des": first ? null : createPreviewObject(data),
          }

          return meta
        }

        return createFakeRecord(encodeObject(data))
      }

      if (isList(data)) {
        if (linkReal) {
          const meta: Data.Array = {
            "@t": "array",
            "@first": first,
            "@size": data.length,
            "@name": data instanceof NodeList ? "NodeList" : null,
            "@des": createPreviewObject(data),
            "@real": createLinkObject(data) //encodeObject(data) as ReturnType<typeof encodeObject> & {
            // length: RealItem<Data.Number>
            // }
          }

          return meta
        }

        return createFakeRecord(encodeObject(data) as Data.ArrayReal)
      }

      if (isTypedArray(data)) {
        if (linkReal) {
          const meta: Data.TypedArray = {
            "@t": "typedarray",
            "@first": first,
            "@size": data.length,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            "@name": (data as unknown as any)[Symbol.toStringTag],
            "@des": createPreviewObject(
              data,
              getOwnDescriptorsTypedArray(data)
            ),
            "@real": createLinkObject(data) // encodeObject(
            // data,
            // getOwnDescriptorsTypedArray(data)
            // ) as Data.TypedArray["@real"]
          }

          return meta
        }

        return createFakeRecord(
          encodeObject(
            data,
            getOwnDescriptorsTypedArray(data)
          ) as Data.TypedArrayReal
        )
      }

      if (isCollection(data)) {
        if (linkReal) {
          const meta: Data.Collection = {
            "@t": "collection",
            "@name": toString
              .call(data)
              .slice(8, -1) as Data.Collection["@name"],
            "@size": (data as Set<unknown>).size ?? null,
            "@entries": Array.from(
              (data as unknown as Map<unknown, unknown>).entries?.() ?? []
            ).map(([key, val]) => [
              Encode(key, false, true),
              Encode(val, false, true)
            ]),
            "@real": createLinkObject(data)
          }
          return meta
        }

        return createFakeRecord({
          size: createRealItem(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Encode((data as unknown as any).size, false, false) as Data.Number,
            true
          ),
          // わかない。ぜんぜんわかない！
          ...encodeObject(data)
        })
      }

      if (isBuffer(data)) {
        if (linkReal) {
          const meta: Data.Buffer = {
            "@t": "buffer",
            "@first": first,
            "@size": data.byteLength,
            "@name": getObjectName(data),
            "@real": createLinkObject(data)
          }

          return meta
        }

        return createFakeRecord({
          ...encodeObject(data, getOwnDescriptorsBuffer(data)),
          "[[Int8Array]]": createRealItem(
            Encode(new Int8Array(data), false, false) as Data.TypedArray,
            true
          ),
          "[[Uint8Array]]": createRealItem(
            Encode(new Uint8Array(data), false, false) as Data.TypedArray,
            true
          ),

          // "[[Int16Array]]": createRealItem(
          //   Encode(new Int16Array(data), false, false) as Data.TypedArray,
          //   true
          // ),
          // "[[Int32Array]]": createRealItem(
          //   Encode(new Int32Array(data), false, false) as Data.TypedArray,
          //   true
          // ),

          "[[ArrayBufferByteLength]]": createRealItem(
            Encode(data.byteLength, false, true) as Data.Number,
            true
          )
        } as Data.BufferReal)
      }

      if (isDataView(data)) {
        if (linkReal) {
          const meta: Data.DataView = {
            "@t": "dataview",
            "@name": "DataView",
            "@first": first,
            "@size": data.byteLength,
            "@real": createLinkObject(data)
          }

          return meta
        }

        return createFakeRecord(
          encodeObject(
            data,
            getOwnDescriptorsDataView(data)
          ) as Data.DataViewReal
        )
      }

      if (isPromise(data)) {
        if (linkReal) {
          // const { state, value } = await getStatePromise(data)

          const meta: Data.Promise = {
            "@t": "promise",
            "@first": first,
            "@state": "pending", //state,
            "@real": createLinkObject(data) ,
            "@des": createPreviewObject(data)// {
            //   ...encodeObject(data)
            //   // "[[PromiseState]]" : Encode(state),
            //   // "[[PromiseResult]]": Encode(value)
            // }
          }

          return meta
        }

        return createFakeRecord(encodeObject(data))
      }

      //なんで？
      if (isDom(data)) {
        if (linkReal) {
          const attrs =
            first && data instanceof Element
              ? Array.from(data.attributes).map((item): [string, string] => [
                  item.name,
                  item.value
                ])
              : undefined
          switch (data.nodeType) {
            case Node.ELEMENT_NODE: {
              return {
                "@t": "element",
                "@name": data.nodeName,
                "@first": first,
                "@attrs": attrs,
                "@real": first ? null : createLinkObject(data),
                "@childs": shouldInline(data)
                  ? data.textContent
                  : createLinkObject(data.childNodes)
              }
            }
            case Node.TEXT_NODE:
            case Node.CDATA_SECTION_NODE:
            case Node.COMMENT_NODE: {
              return {
                "@t": "element", //  #text
                "@name": data.nodeName,
                "@first": first,
                "@attrs": attrs,
                "@real": first ? null : createLinkObject(data),
                "@childs": data.textContent
              }
            }
            case Node.PROCESSING_INSTRUCTION_NODE:
              return {
                "@t": "element",
                "@name": data.nodeName, // ?
                "@first": first,
                "@attrs": attrs,
                "@real": first ? null : createLinkObject(data)
              }
            case Node.DOCUMENT_TYPE_NODE:
              return {
                "@t": "element",
                "@name": data.nodeName, // html
                "@first": first,
                "@attrs": attrs,
                "@real": first ? null : createLinkObject(data),
                "@childs": `<!DOCTYPE ${
                  (data as unknown as DocumentType).name
                } ${
                  (data as unknown as DocumentType).publicId
                    ? ` PUBLIC "${(data as unknown as DocumentType).publicId}"`
                    : ""
                } ${
                  !(data as unknown as DocumentType).publicId &&
                  (data as unknown as DocumentType).systemId
                    ? " SYSTEM"
                    : ""
                } ${
                  (data as unknown as DocumentType).systemId
                    ? ` "${(data as unknown as DocumentType).systemId}"`
                    : ""
                } >`
              }
            case Node.DOCUMENT_NODE:
              return {
                "@t": "element",
                "@name": data.nodeName, // #document
                "@first": first,
                "@attrs": attrs,
                "@real": first ? null : createLinkObject(data)
              }
            case Node.DOCUMENT_FRAGMENT_NODE:
              return {
                "@t": "element",
                "@name": data.nodeName, // #document-fragment
                "@first": first,
                "@attrs": attrs,
                "@real": null
              }
            default:
              return {
                "@t": "element",
                "@name":
                  "#" +
                    nameByNodeType[
                      data.nodeType as keyof typeof nameByNodeType
                    ] ?? "#unknown",
                "@first": first,
                "@real": first ? null : createLinkObject(data)
              }
          }
        }

        return createFakeRecord(encodeObject(data))
      }

      // getsyoubi no tawata
      const meta: Data.Record = {
        "@t": "object",
        "@name": data.constructor?.name ?? null,
        "@first": first,
        // わかない。ぜんぜんわかない！
        "@real": linkReal ? createLinkObject(data) : encodeObject(data),
        "@des": linkReal ? createPreviewObject(data) : null
      }
      return meta
    }
    // undefined, object, function
  }
}

function createFakeRecord<T extends Data.objReal>(
  value: T,
  name: string | null = null
): Data.Record {
  return {
    "@t": "object",
    "@name": name,
    "@first": false,
    "@real": value,
    "@des": null
  }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DataPreview {
  export type Record = Pick<Data.Record, "@t" | "@name">
  export type Error = Pick<Data.Error, "@t" | "@stack">
  export type RegExp = Pick<Data.RegExp, "@t" | "@name">
  export type Collection = Pick<Data.Collection, "@t" | "@name" | "@size">
  export type Array = Pick<Data.Array, "@t" | "@size" | "@name">
  export type Function = Pick<Data.Function, "@t" | "@name">
  export type Element = Pick<Data.Element, "@t" | "@name">
  export type Promise = Pick<Data.Promise, "@t">
  export type Date = Pick<Data.Date, "@t" | "@value">
  export type TypedArray = Pick<Data.TypedArray, "@t" | "@size" | "@name">
  export type Buffer = Pick<Data.Buffer, "@t" | "@size" | "@name">
  export type DataView = Pick<Data.DataView, "@t" | "@size" | "@name">

  export interface objReal {
    [name: string]: RealItem<
      | Record
      | Error
      | RegExp
      | Collection
      | Array
      // eslint-disable-next-line @typescript-eslint/ban-types
      | Function
      | Element
      | Promise
      | Date
      | TypedArray
      | Buffer
      | DataView
      | Data.String
      | Data.Number
      | Data.BigInt
      | Data.Symbol
      | Data.Nill
    >
  }
}
/**
 * @description show prototype public
 */
function createPreviewObject(
  data: object,
  extendsPropertyDescriptors?: Record<string, PropertyDescriptor>
): {
  "@value": DataPreview.objReal
  "@lastKey": string
} {
  let lastKey: string | number | symbol = ""
  const meta = Object.fromEntries(
    entries(
      Object.assign(
        getOwnDescriptorsIn(data),
        Object.getOwnPropertyDescriptors(data),
        extendsPropertyDescriptors //data instanceof RegExp ? getOwnDescriptorsRegExp(data) : undefined
      )
    ).map(([name, meta]): [string, DataPreview.objReal[""]] => {
      name = name.toString()
      lastKey = name
      const { value } = meta
      if (value instanceof Error) {
        return [
          name,
          createRealItem(
            {
              "@t": "error",
              "@stack": value.stack?.split("\n", 3).slice(0, 3).join("\n") ?? ""
            },
            !meta.enumerable
          )
        ]
      }
      if (value instanceof RegExp) {
        return [
          name,
          createRealItem(
            {
              "@t": "regexp",
              "@name": value + ""
            },
            !meta.enumerable
          )
        ]
      }
      if (value instanceof Date) {
        return [
          name,
          createRealItem(
            {
              "@t": "date",
              "@value": value.toString()
            },
            !meta.enumerable
          )
        ]
      }
      if (isCollection(value)) {
        return [
          name,
          createRealItem(
            {
              "@t": "collection",
              "@name": toString
                .call(value)
                .slice(8, -1) as Data.Collection["@name"],
              "@size": (value as Set<unknown>).size ?? null
            },
            !meta.enumerable
          )
        ]
      }
      if (isList(value)) {
        return [
          name,
          createRealItem(
            {
              "@t": "array",
              "@name": value instanceof NodeList ? "NodeList" : null,
              "@size": value.length
            },
            !meta.enumerable
          )
        ]
      }
      if (isTypedArray(value)) {
        return [
          name,
          createRealItem(
            {
              "@t": "typedarray",
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              "@name": (value as unknown as any)[Symbol.toStringTag],
              "@size": value.length
            },
            !meta.enumerable
          )
        ]
      }
      if (isBuffer(value)) {
        return [
          name,
          createRealItem(
            {
              "@t": "buffer",
              "@name": getObjectName(value),
              "@size": value.byteLength
            },
            !meta.enumerable
          )
        ]
      }
      if (isDataView(value)) {
        return [
          name,
          createRealItem(
            {
              "@t": "dataview",
              "@name": "DataView",
              "@size": value.byteLength
            },
            !meta.enumerable
          )
        ]
      }

      if (isDom(value)) {
        return [
          name,
          createRealItem(
            {
              "@t": "element",
              "@name": value.nodeName
            },
            !meta.enumerable
          )
        ]
      }

      if (isPromise(value)) {
        return [
          name,
          createRealItem(
            {
              "@t": "promise"
            },
            !meta.enumerable
          )
        ]
      }

      if (value !== null && typeof value === "object") {
        return [
          name,
          createRealItem(
            {
              "@t": "object",
              "@name": value.constructor?.name ?? null
            },
            !meta.enumerable
          )
        ]
      }
      if (typeof value === "function") {
        return [
          name,
          createRealItem(
            {
              "@t": "function",
              "@name": ""
            },
            !meta.enumerable
          )
        ]
      }

      return [
        name,
        createRealItem(Encode(value, false, true), !meta.enumerable)
      ]
    })
  )

  return {
    "@value": meta,
    "@lastKey": lastKey
  }
}
function encodeObject(
  data: object | Function | RegExp,
  extendsPropertyDescriptors?: Record<string, PropertyDescriptor>,
  proto: object | Function = Object.getPrototypeOf(data)
): Data.objReal {
  const meta = Object.fromEntries(
    entries(
      Object.assign(
        getOwnDescriptorsIn(data),
        Object.getOwnPropertyDescriptors(data),
        extendsPropertyDescriptors //data instanceof RegExp ? getOwnDescriptorsRegExp(data) : undefined
      )
    ).map(([name, meta]): [string, Data.objReal[""]] => {
      const { value } = meta
      if ("get" in meta || "set" in meta) {
        const at: Partial<Record<"get" | "set", Data.Function>> = {}
        if (meta.get) at.get = Encode(meta.get, false, false) as Data.Function
        if (meta.set) at.set = Encode(meta.set, false, false) as Data.Function
        return [
          name.toString(),
          createRealItem(
            {
              "@t": "gs",
              "@value": createLinkObject(() => getValue(data, name, data)), //meta.get?.(),
              "@at": at
            },
            !meta.enumerable
          )
        ]
      }
      if (
        value !== null &&
        typeof value === "object" &&
        !(value instanceof RegExp) &&
        !isCollection(value) &&
        !(value instanceof Error) &&
        !isList(value)
      ) {
        return [
          name.toString(),
          createRealItem(
            Encode(value, false, true), //createLinkObject(value),
            !meta.enumerable
          )
        ]
      }
      if (typeof value === "function") {
        return [
          name.toString(),
          createRealItem(
            Encode(value, false, true), //createLinkObject(value),
            !meta.enumerable
          )
        ]
      }

      return [
        name.toString(),
        createRealItem(Encode(value, false, true), !meta.enumerable)
      ]
    })
  )

  return Object.assign(meta, {
    "[[Prototype]]": createRealItem(Encode(proto, false, true), true)
  })
}
/// ===================== On The Road! たのたぴたぢたの。さなたびさにどさ =====================
