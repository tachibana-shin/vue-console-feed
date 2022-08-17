// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isDataView(buff: any): buff is DataView {
  return buff instanceof DataView
}