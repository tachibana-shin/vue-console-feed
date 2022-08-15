export function getValue(
  data: object,
  name: string | symbol | number,
  receiver: object
) {
  try {
    return Reflect.get(data, name, receiver)
  } catch (e) {
    return e
  }
}
