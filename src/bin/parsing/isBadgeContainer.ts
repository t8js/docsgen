let badgeImageSelector =
  'img[src^="https://img.shields.io/"], img[src^="https://flat.badgen.net/"]';

export function isBadgeContainer(element: Element) {
  if (!element.matches("p") || element.children.length === 0) return false;

  for (let e of element.children) {
    if (
      !e.matches(badgeImageSelector) &&
      (!e.matches("a") ||
        e.children.length !== 1 ||
        !e.children[0]?.matches(badgeImageSelector))
    )
      return false;
  }

  return true;
}
