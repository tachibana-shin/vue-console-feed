// "warn" | "info" | "debug" | "error" | "output" | "log"
// "table"
// "group" | "groupEnd"

import { reactive, readonly } from "vue"

import { Encode } from "./Encode"
import type { Table } from "./Table"

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

export class DataAPI {
  public value: (LogData | TableData | GroupData)[] = reactive([])

  private queueGroups: GroupData[] = []

  private counters = new Map<string, number>()
  private timers = new Map<string, number>()

  private basicMethod(
    type: "warn" | "info" | "debug" | "error" | "log",
    data: ReturnType<typeof Encode>[]
  ): void {
    // eslint-disable-next-line functional/no-let
    let lastItem: typeof this.value[0]
    if (this.queueGroups.length > 0) {
      const lastGroup = this.queueGroups[this.queueGroups.length - 1]
      lastItem = lastGroup["@items"][lastGroup["@items"].length - 1]
    } else {
      lastItem = this.value[this.value.length - 1]
    }

    if (
      !isGroup(lastItem) &&
      lastItem.type === type &&
      lastItem.data.length === data.length &&
      lastItem.data.every((item, index) => item["@id"] === data[index]["@id"])
    ) {
      lastItem.count++
      return
    }

    this.pushOfData({
      type,
      data: readonly(data),
      count: 1
    })
  }

  // eslint-disable-next-line functional/functional-parameters
  public log(...data: ReturnType<typeof Encode>[]): void {
    this.basicMethod("log", data)
  }

  // eslint-disable-next-line functional/functional-parameters
  public warn(...data: ReturnType<typeof Encode>[]): void {
    this.basicMethod("warn", data)
  }

  // eslint-disable-next-line functional/functional-parameters
  public info(...data: ReturnType<typeof Encode>[]): void {
    this.basicMethod("info", data)
  }

  // eslint-disable-next-line functional/functional-parameters
  public debug(...data: ReturnType<typeof Encode>[]): void {
    this.basicMethod("debug", data)
  }

  // eslint-disable-next-line functional/functional-parameters
  public error(...data: ReturnType<typeof Encode>[]): void {
    this.basicMethod("error", data)
  }

  public table(data: ReturnType<typeof Table>): void {
    this.pushOfData({
      type: "table",
      data: readonly(data)
    })
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

  public group(key: ReturnType<typeof Encode> = Encode("console.group")): void {
    const newGroup = {
      "@key": readonly(key),
      "@items": []
    }

    this.pushOfData(newGroup)
    this.queueGroups.push(newGroup)
  }

  public groupEnd(
    key: ReturnType<typeof Encode> = Encode("console.group")
  ): void {
    // eslint-disable-next-line functional/no-let
    for (let i = this.queueGroups.length - 1; i >= 0; i--) {
      if (this.queueGroups[i]["@key"]["@id"] === key["@id"]) {
        // end task
        this.queueGroups.splice(i)
        break
      }
    }
  }

  public count(key: unknown = "default") {
    // eslint-disable-next-line functional/no-let
    let count: number | undefined
    if ((count = this.counters.get(key + ""))) {
      count++
    } else {
      count = 1
    }

    this.counters.set(key + "", count)
    this.log(Encode(`${key}: ${count}`))
  }

  public countReset(key: unknown = "default") {
    this.counters.delete(key + "")
  }

  public time(key: unknown = "default") {
    if (this.timers.has(key + "")) {
      this.warn(Encode(`Timer '${key}' already exists`))
      return
    }

    this.timers.set(key + "", performance.now())
  }

  public timeLog(key: unknown = "default") {
    const timer = this.timers.get(key + "")
    if (!timer) {
      this.warn(Encode(`Timer '${key}' does not exist`))
      return
    }

    this.log(Encode(`${key}: ${performance.now() - timer}`))
  }

  public timeEnd(key: unknown = "default") {
    this.timeLog(key)
    this.timers.delete(key + "")
  }

  public clear() {
    this.value.splice(0)
    this.queueGroups.splice(0)
    this.counters.clear()
    this.timers.clear()
  }
}
