import { describe, expect, test } from "vitest"

import type { Data } from "./Encode"
import { Encode } from "./Encode"

describe("Encode", () => {
  test("encode", () => {
    const tt = {
      r: /script/,
      e: new WeakMap(),
      c: new Map([[45, [789, 89]]]),
      s: new Set([2, 54, 65, [123], () => 2]),
      ae: [
        /script/,
        new WeakMap(),
        new Map([[45, [789, 89]]]),
        1,
        3,
        [43, 5, 76, 23],
        { a: 34 },
        1,
        3,
        { a: 34 },
        1,
        3,
        { a: 34 },
        1,
        3,
        { a: 34 },
        1,
        3,
        { a: 34 },
        1,
        3,
        { a: 34 },
        1,
        3,
        { a: 34 },
        1,
        3,
        { a: 34 },
        1,
        3,
        { a: 34 },
        1,
        3,
        { a: 34 },
        1,
        3,
        { a: 34 },
        1,
        3,
        { a: 34 },
        1,
        3,
        { a: 34 },
        1,
        3,
        { a: 34 }
      ],
      foo: { x: 245, y: 843 },
      year: 10,
      name: "Shin",
      b: 129n,
      err: new Error("this message error"),
      sym: Symbol("a"),
      map: new Map([[45, [789, 89]]]),
      get lusa() {
        return this.year ** 2
      },
      matcher: /<script\s+>/,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      increment: function increment(_value = 56) {
        this.year++
      },
      abort: new AbortController()
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(tt as unknown as any).tt = tt

    const result = Encode(tt) as Data.Record

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(result["@des"]!["@value"]).not.toEqual(null)
    expect(() => JSON.stringify(result)).not.toThrow()
  })
})
