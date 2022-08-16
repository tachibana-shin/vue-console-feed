export async function getStatePromise(promise: Promise<unknown>): Promise<
  | {
      state: "pending"
      value: undefined
    }
  | {
      state: "fulfilled" | "rejected"
      value: unknown
    }
> {
  try {
    const address = Object.create(null)

    const result = await Promise.race([promise, address])

    if (result === address) {
      return {
        state: "pending",
        value: undefined
      }
    }

    return {
      state: "fulfilled",
      value: result
    }
  } catch (err) {
    return {
      state: "rejected",
      value: err
    }
  }
}
