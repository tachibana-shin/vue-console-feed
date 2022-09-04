import { describe, expect, test } from "vitest"

import { printfArgs } from "./DataAPI"

describe("printfArgs", () => {
  test("no printf", () => {
    expect(printfArgs(["hello ", "world"])).toEqual(["hello ", "world"])
  })
  test("1 %s, 1 arg", () => {
    expect(printfArgs(["hello %s", "world"])).toEqual(["hello world"])
  })
  test("1 %s, multi arg", () => {
    expect(printfArgs(["hello %s", "world", " wa anime"])).toEqual([
      "hello world",
      " wa anime"
    ])
  })
  test("multi %s, 1 arg", () => {
    expect(printfArgs(["hello %s %s", "world"])).toEqual(["hello world %s"])
  })
})
