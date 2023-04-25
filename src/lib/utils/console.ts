const YELLOW = '\x1b[33m'
const RESET = '\x1b[0m'
const GRAY = '\x1b[90m'

export function warn(string: string) {
  console.log([YELLOW, string, RESET].join(''))
}

export function muted(string: string) {
  console.log([GRAY, string, RESET].join(''))
}
