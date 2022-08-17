const types = [
  Int8Array,
  Uint8Array,
  Uint8ClampedArray,

  Int16Array,
  Uint16Array,

  Int32Array,
  Uint32Array,

  Float32Array,
  Float64Array,

  BigInt64Array,
  BigUint64Array
]

export type TypedArray = typeof types[0]

export function isTypedArray(arr: any): arr is TypedArray {
  return types.some((item) => arr instanceof item)
}
