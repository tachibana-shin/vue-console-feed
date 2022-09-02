// "warn" | "info" | "debug" | "error" | "output" | "log"
// "table"
// "group" | "groupEnd"

import { sprintf } from "sprintf-js"
import { readonly, shallowReactive } from "vue"

import { Encode } from "./Encode"
import { isTable, Table } from "./Table"
import { get } from "./id-manager"

interface LogData {
  readonly data: readonly ReturnType<typeof Encode>[]
  count: number
  readonly type: "warn" | "info" | "debug" | "error" | "output" | "log"
}
interface TableData {
  readonly data: ReturnType<typeof Table>
  readonly type: "table"
}

export interface GroupData {
  readonly "@key": ReturnType<typeof Encode>
  readonly "@items": (LogData | TableData | GroupData)[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isGroup(data: any): data is GroupData {
  return typeof data?.["@items"]?.length === "number"
}

export function printfArgs<T extends unknown[]>(args: T) {
  if (args.length > 0 && typeof args[0] === "string") {
    const countParaments = args[0].match(/%\d/g)?.length

    if (countParaments) {
      return [
        sprintf(args[0], ...args.slice(1, countParaments + 1)),
        ...args.slice(countParaments + 2)
      ]
    }
  }

  return args
}

export class DataAPI<
  Encoded extends boolean = true,
  Data extends Encoded extends true
    ? ReturnType<typeof Encode>
    : unknown = Encoded extends true ? ReturnType<typeof Encode> : unknown
> {
  public value: (LogData | TableData | GroupData)[] = shallowReactive([])

  private queueGroups: GroupData[] = []

  private counters = new Map<string, number>()
  private timers = new Map<string, number>()

  private encoded: Encoded

  constructor(encoded: Encoded) {
    this.encoded = encoded
  }

  private basicMethod(
    type: "warn" | "info" | "debug" | "error" | "log",
    data: Data[]
  ): void {
    // これ
    const dataEncoded = (
      this.encoded ? data : printfArgs(data).map((item) => Encode(item))
    ) as readonly ReturnType<typeof Encode>[]
    // eslint-disable-next-line functional/no-let
    let lastItem: typeof this.value[0]
    if (this.queueGroups.length > 0) {
      const lastGroup = this.queueGroups[this.queueGroups.length - 1]
      lastItem = lastGroup["@items"][lastGroup["@items"].length - 1]
    } else {
      lastItem = this.value[this.value.length - 1]
    }

    if (
      lastItem &&
      !isGroup(lastItem) &&
      lastItem.type === type &&
      lastItem.data.length === dataEncoded.length &&
      lastItem.data.every(
        (item, index) => item["@id"] === dataEncoded[index]["@id"]
      )
    ) {
      lastItem.count++
      return
    }

    this.pushOfData({
      type,
      data: readonly(dataEncoded) as typeof dataEncoded,
      count: 1
    })
  }

  // eslint-disable-next-line functional/functional-parameters
  public log(...data: Data[]): void {
    this.basicMethod("log", data)
  }

  // eslint-disable-next-line functional/functional-parameters
  public warn(...data: Data[]): void {
    this.basicMethod("warn", data)
  }

  // eslint-disable-next-line functional/functional-parameters
  public info(...data: Data[]): void {
    this.basicMethod("info", data)
  }

  // eslint-disable-next-line functional/functional-parameters
  public debug(...data: Data[]): void {
    this.basicMethod("debug", data)
  }

  // eslint-disable-next-line functional/functional-parameters
  public error(...data: Data[]): void {
    this.basicMethod("error", data)
  }

  public table(
    data: Encoded extends true
      ? ReturnType<typeof Table> | ReturnType<typeof Encode>
      : unknown
  ): void {
    if (this.encoded) {
      /// encode
      if (isTable(data)) {
        this.pushOfData({
          type: "table",
          data: readonly(data) as typeof data
        })
        return
      }

      this.log(data as Data)
      return
    }

    if (typeof data === "object") {
      this.pushOfData({
        type: "table",
        data: readonly(Table(data as unknown as object)) as ReturnType<
          typeof Table
        >
      })

      return
    }

    this.log(data as unknown as Data)
  }

  private pushOfData(data: LogData | TableData | GroupData): void {
    if (this.queueGroups.length > 0) {
      const currentGroup = this.queueGroups[this.queueGroups.length - 1]

      // exists
      currentGroup["@items"].push(data)
      return
    }

    this.value.push(data)
  }

  public group(
    key: Data = (this.encoded
      ? Encode("console.group")
      : "console.group") as Data
  ): void {
    const newGroup: GroupData = {
      "@key": readonly(
        this.encoded ? (key as ReturnType<typeof Encode>) : Encode(key)
      ) as ReturnType<typeof Encode>,
      "@items": shallowReactive([])
    }

    this.pushOfData(newGroup)
    this.queueGroups.push(newGroup)
  }

  public groupEnd(
    key: Data = (this.encoded
      ? Encode("console.group")
      : "console.group") as Data
  ): void {
    const idKey = this.encoded
      ? (key as ReturnType<typeof Encode>)["@id"]
      : get(key)
    // eslint-disable-next-line functional/no-let
    for (let i = this.queueGroups.length - 1; i >= 0; i--) {
      if (this.queueGroups[i]["@key"]["@id"] === idKey) {
        // end task
        this.queueGroups.splice(i)
        break
      }
    }
  }

  public count(key: unknown = "default"): void {
    // eslint-disable-next-line functional/no-let
    let count: number | undefined
    if ((count = this.counters.get(key + ""))) {
      count++
    } else {
      count = 1
    }

    this.counters.set(key + "", count)
    const message = `${key}: ${count}`
    this.log((this.encoded ? Encode(message) : message) as Data)
  }

  public countReset(key: unknown = "default"): void {
    this.counters.delete(key + "")
  }

  public time(key: unknown = "default"): void {
    if (this.timers.has(key + "")) {
      const message = `Timer '${key}' already exists`
      this.warn((this.encoded ? Encode(message) : message) as Data)
      return
    }

    this.timers.set(key + "", performance.now())
  }

  public timeLog(key: unknown = "default"): void {
    const timer = this.timers.get(key + "")
    if (!timer) {
      const message = `Timer '${key}' does not exist`
      this.warn((this.encoded ? Encode(message) : message) as Data)
      return
    }

    const message = `${key}: ${performance.now() - timer} ms`
    this.log((this.encoded ? Encode(message) : message) as Data)
  }

  public timeEnd(key: unknown = "default"): void {
    this.timeLog(key)
    this.timers.delete(key + "")
  }

  public clear(): void {
    this.value.splice(0)
    this.queueGroups.splice(0)
    this.counters.clear()
    this.timers.clear()
  }
}
