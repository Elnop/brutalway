export function onRouterTransitionStart(url: string): void {
  performance.mark(url);
}
