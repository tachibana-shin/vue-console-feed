// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isBuffer(buff: any): buff is ArrayBuffer {
  return buff instanceof ArrayBuffer
}
