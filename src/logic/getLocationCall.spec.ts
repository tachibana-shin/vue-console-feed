import { describe, expect, test } from "vitest"

import { getLocationCall } from "./getLocationCall"

describe("getLocationCall", () => {
  test("normal", () => {
    expect(getLocationCall().includes("/src/logic/getLocationCall.spec.ts")).toEqual(true)
  })
})
