export function isTruthy<T>(value?: T | undefined | null | false): value is T {
  return !!value
}

export function onlyUnique<T>(value: T, index: number, array: T[]): boolean {
  return array.indexOf(value) === index
}
