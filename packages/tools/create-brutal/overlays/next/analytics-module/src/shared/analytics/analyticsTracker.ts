export const analyticsTracker = {
  track(name: string, properties: Record<string, string | number | boolean> = {}): void {
    window.dispatchEvent(new CustomEvent('analytics', { detail: { name, properties } }));
  },
};
