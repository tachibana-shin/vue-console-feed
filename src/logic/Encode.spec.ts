import { describe, test, expect } from "vitest"
import { Data, Encode } from "./Encode"

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
      matcher: /\<script\s+\>/,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      increment: function increment(_value = 56) {
        this.year++
      },
      abort: new AbortController()
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(tt as unknown as any).tt = tt

    const result = Encode(tt, true, true) as Data.Record

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(result["@des"]!["@value"]).toEqual({
      r: {
        "@hidden": false,
        "@value": { "@t": "regexp", "@name": "/script/" }
      },
      e: {
        "@hidden": false,
        "@value": { "@t": "collection", "@name": "WeakMap", "@size": null }
      },
      c: {
        "@hidden": false,
        "@value": { "@t": "collection", "@name": "Map", "@size": 1 }
      },
      s: {
        "@hidden": false,
        "@value": { "@t": "collection", "@name": "Set", "@size": 5 }
      },
      ae: { "@hidden": false, "@value": { "@t": "array", "@size": 46 } },
      foo: {
        "@hidden": false,
        "@value": { "@t": "object", "@name": "Object" }
      },
      year: {
        "@hidden": false,
        "@value": { "@t": "number", "@value": "10" }
      },
      name: {
        "@hidden": false,
        "@value": { "@t": "string", "@value": "Shin" }
      },
      b: { "@hidden": false, "@value": { "@t": "bint", "@value": "129n" } },
      err: {
        "@hidden": false,
        "@value": {
          "@t": "error",
          "@name": "Error",
          "@stack":
            "Error: this message error\n    at /workspaces/vue-console/src/logic/Encode.spec.ts:64:12\n    at /workspaces/vue-console/node_modules/.pnpm/vitest@0.13.1_sass@1.54.4/node_modules/vitest/dist/chunk-runtime-chain.46442ffe.js:1952:36"
        }
      },
      sym: {
        "@hidden": false,
        "@value": { "@t": "symbol", "@value": "Symbol(a)" }
      },
      map: {
        "@hidden": false,
        "@value": { "@t": "collection", "@name": "Map", "@size": 1 }
      },
      lusa: {
        "@hidden": false,
        "@value": { "@t": "number", "@value": "100" }
      },
      matcher: {
        "@hidden": false,
        "@value": { "@t": "regexp", "@name": "/\\<script\\s+\\>/" }
      },
      increment: {
        "@hidden": false,
        "@value": { "@t": "function", "@name": "" }
      },
      abort: {
        "@hidden": false,
        "@value": { "@t": "object", "@name": "AbortController" }
      },
      tt: {
        "@hidden": false,
        "@value": { "@t": "object", "@name": "Object" }
      }
    })

    expect(() => JSON.stringify(result)).not.toThrow()
  })
})
