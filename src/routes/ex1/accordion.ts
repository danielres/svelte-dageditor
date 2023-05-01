export function accordion(node: HTMLElement, count: number) {
  let initialHeight = node.offsetHeight
  node.style.transitionProperty = 'height'
  node.style.transitionTimingFunction = 'ease-in-out'
  return {
    update(count: number) {
      const isOpen = count > 0
      node.style.height = (isOpen ? initialHeight : 10) + 'px'
      node.style.transitionDuration = isOpen ? '100ms' : '400ms'
    },
  }
}
