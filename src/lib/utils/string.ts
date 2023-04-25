export function dedent(str: string) {
  return ('' + str).replace(/(\n)\s+/g, '$1')
}

export function rand() {
  return String(Math.random()).split('.')[1].slice(0, 8)
}

export function removeBlankLines(str: string) {
  return str
    .split('\n')
    .filter((s) => s)
    .join('\n')
}
