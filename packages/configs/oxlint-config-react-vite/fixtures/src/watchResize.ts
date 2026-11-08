export function watchResize(onResize: () => void) {
  window.onresize = onResize;
}
