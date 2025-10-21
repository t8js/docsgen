import type { JSDOM } from "jsdom";
import type { Context } from "../../types/Context";
import type { NavItem } from "../../types/NavItem";
import { getSlug } from "../getSlug";

export function buildNav(ctx: Context, dom: JSDOM) {
  let { root, contentDir, singlePage } = ctx;
  let linkMap: Record<string, string> = {};

  let navItem: NavItem | null = null;
  let nav: NavItem[] = [];

  if (singlePage)
    navItem = {
      id: "Overview",
      title: "Overview",
      items: [],
    };

  let headings =
    dom.window.document.body.querySelectorAll("h2, h3, h4, h5, h6");

  for (let element of headings) {
    let tagName = element.tagName.toLowerCase();

    let isSectionTitle = tagName === "h2";
    let isSubsectionTitle = tagName === "h3";
    let slug = getSlug(element.textContent);

    let sectionId = isSectionTitle ? slug : (navItem?.id ?? "");
    let link = `${root}${contentDir}/${sectionId}`;

    let elementId = element.id || slug.toLowerCase().replace(/_/g, "-");

    if (elementId)
      linkMap[`#${elementId}`] = `${link}${isSectionTitle ? "" : `#${slug}`}`;

    if (singlePage && isSectionTitle) {
      if (navItem) {
        element.id = slug;
        navItem.items.push({
          id: slug,
          title: element.innerHTML.trim(),
        });
      }
    } else if (isSectionTitle) {
      if (navItem) nav.push(navItem);

      navItem = {
        id: slug,
        title: element.innerHTML.trim(),
        items: [],
      };
    } else if (isSubsectionTitle) {
      if (navItem) {
        element.id = slug;
        navItem.items.push({
          id: slug,
          title: element.innerHTML.trim(),
        });
      }
    }
  }

  if (navItem) nav.push(navItem);

  return {
    nav,
    linkMap,
  };
}
