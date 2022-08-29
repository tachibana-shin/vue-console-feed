/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { describe, expect, test } from "vitest"

import { getHeaderFn, TypesFn } from "./getHeaderFn"

// getHeaderFn(a.as + "")
// getHeaderFn(a.ac + "")
// getHeaderFn(a.sas + "")
// getHeaderFn(a.sac + "")

describe("getHeaderFn", () => {
  test("arrow function", () => {
    // eslint-disable-next-line functional/functional-parameters
    const a = async (v: string, vv: string, ...vvv: string[]) => {}
    // eslint-disable-next-line functional/functional-parameters
    const aa = (v: string, vv: string, ...vvv: string[]) => {}

    expect(getHeaderFn(a + "")).toEqual({
      name: "",
      args: "(v, vv, ...vvv)",
      content: "{ }",
      isAsync: true,
      isStar: false,
      typeFn: TypesFn.arrowFn
    })
    expect(getHeaderFn(aa + "")).toEqual({
      name: "",
      args: "(v, vv, ...vvv)",
      content: "{ }",
      isAsync: false,
      isStar: false,
      typeFn: TypesFn.arrowFn
    })
  })
  test("normal function", () => {
    const b = async function name(params: string) {}
    const bb = function name(params: string) {}

    expect(getHeaderFn(b + "")).toEqual({
      name: "name",
      args: "(params)",
      isAsync: true,
      content: undefined,
      isStar: false,
      typeFn: TypesFn.fn
    })
    expect(getHeaderFn(bb + "")).toEqual({
      name: "name",
      args: "(params)",
      isAsync: false,
      content: undefined,
      isStar: false,
      typeFn: TypesFn.fn
    })
  })
  test("star function", () => {
    const c = async function* name(params: string) {}
    const cc = function* name(params: string) {}

    expect(getHeaderFn(c + "")).toEqual({
      name: "name",
      args: "(params)",
      isAsync: true,
      isStar: true,
      content: undefined,
      typeFn: TypesFn.fn
    })
    expect(getHeaderFn(cc + "")).toEqual({
      name: "name",
      args: "(params)",
      isAsync: false,
      isStar: true,
      content: undefined,
      typeFn: TypesFn.fn
    })
  })
  test("star function empty args", () => {
    const d = async function* name() {}
    const dd = function* name() {}

    expect(getHeaderFn(d + "")).toEqual({
      name: "name",
      args: "()",
      isAsync: true,
      isStar: true,
      typeFn: TypesFn.fn
    })
    expect(getHeaderFn(dd + "")).toEqual({
      name: "name",
      args: "()",
      isAsync: false,
      isStar: true,
      typeFn: TypesFn.fn
    })
  })
  test("prop function", () => {
    const a = {
      // eslint-disable-next-line require-yield
      *as() {
        // eslint-disable-next-line no-unused-expressions
        alert
      },
      ac() {},
      async *sas() {},
      async sac() {},
      arr: () => {
        // eslint-disable-next-line no-unused-expressions
        alert
      },
      arrNoR: () => 2332,
      param(value: string) {
        return value
      },
      arrParam: (value: string) => value
    }

    expect(getHeaderFn(a.as + "")).toEqual({
      name: "as",
      args: "()",
      content: undefined,
      isAsync: false,
      isStar: true,
      typeFn: TypesFn.propFn
    })
    expect(getHeaderFn(a.ac + "")).toEqual({
      name: "ac",
      args: "()",
      content: undefined,
      isAsync: false,
      isStar: false,
      typeFn: TypesFn.propFn
    })
    expect(getHeaderFn(a.sas + "")).toEqual({
      name: "sas",
      args: "()",
      content: undefined,
      isAsync: true,
      isStar: true,
      typeFn: TypesFn.propFn
    })
    expect(getHeaderFn(a.sac + "")).toEqual({
      name: "sac",
      args: "()",
      content: undefined,
      isAsync: true,
      isStar: false,
      typeFn: TypesFn.propFn
    })
    expect(getHeaderFn(a.arr + "")).toEqual({
      name: "",
      args: "()",
      content: "{ alert; }",
      isAsync: false,
      isStar: false,
      typeFn: TypesFn.arrowFn
    })
    expect(getHeaderFn(a.arrNoR + "")).toEqual({
      name: "",
      args: "()",
      content: "2332",
      isAsync: false,
      isStar: false,
      typeFn: TypesFn.arrowFn
    })
    expect(getHeaderFn(a.param + "")).toEqual({
      name: "param",
      args: "(value)",
      content: undefined,
      isAsync: false,
      isStar: false,
      typeFn: TypesFn.propFn
    })
    expect(getHeaderFn(a.arrParam + "")).toEqual({
      name: "",
      args: "(value)",
      content: "value",
      isAsync: false,
      isStar: false,
      typeFn: TypesFn.arrowFn
    })
  })
})
