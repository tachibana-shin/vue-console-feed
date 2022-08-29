import { describe, expect, test } from "vitest"

import { getLocationCall } from "./getLocationCall"

describe("getLocationCall", () => {
  test("normal", () => {
    expect(getLocationCall().endsWith("/src/logic/getLocationCall.spec.ts:6:56")).toEqual(true)
  })
})
