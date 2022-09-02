import { describe, expect, test } from "vitest"

import { getLocationCall } from "./getLocationCall"

describe("getLocationCall", () => {
  test("normal", () => {
    expect(getLocationCall(-2).includes("/src/logic/getLocationCall.spec.ts")).toEqual(true)
  })
})
