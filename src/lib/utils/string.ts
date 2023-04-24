export function rand() {
  return String(Math.random()).split('.')[1].slice(0, 8)
}
