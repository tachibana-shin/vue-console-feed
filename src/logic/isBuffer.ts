export function isBuffer(buff: any): buff is ArrayBuffer {
  return buff instanceof ArrayBuffer
}