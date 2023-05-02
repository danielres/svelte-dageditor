export function flash(node: HTMLElement) {
  requestAnimationFrame(() => {
    node.style.transition = 'none'
    node.style.backgroundColor = 'hsla(30, 100%, 60%, 0.1)'

    setTimeout(() => {
      node.style.transition = 'color 1s, background 2s'
      node.style.backgroundColor = ''
    })
  })
}
