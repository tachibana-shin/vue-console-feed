export function keys<T extends object>(obj: T): (string | number | symbol)[] {
  const keys: (string | number | symbol)[] = [
    ...Object.getOwnPropertyNames(obj),
    ...Object.getOwnPropertySymbols(obj)
  ]

  return keys
}

//　チェック
