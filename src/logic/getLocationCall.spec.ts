import { describe, expect, test } from "vitest"

import { getLocationCall } from "./getLocationCall"

describe("getLocationCall", () => {
  test("normal", () => {
    expect(getLocationCall()).toEqual(
      "/workspaces/vue-console/src/logic/getLocationCall.spec.ts:7:56"
    )
  })
})
