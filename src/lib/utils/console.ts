const YELLOW = '\x1b[33m'

export function warn(string: string) {
  console.log([YELLOW, string].join(' '))
}
