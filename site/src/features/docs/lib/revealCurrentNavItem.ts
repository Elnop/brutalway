const NAV_MARGIN = 16;

export function revealCurrentNavItem(): void {
  const nav = document.querySelector('.docs-nav');
  const item = nav?.querySelector('[aria-current="location"]');
  if (nav === null || nav === undefined || item === null || item === undefined) return;
  const navBox = nav.getBoundingClientRect();
  const itemBox = item.getBoundingClientRect();
  if (itemBox.top < navBox.top) nav.scrollBy({ top: itemBox.top - navBox.top - NAV_MARGIN });
  else if (itemBox.bottom > navBox.bottom) {
    nav.scrollBy({ top: itemBox.bottom - navBox.bottom + NAV_MARGIN });
  }
}
