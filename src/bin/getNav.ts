import { JSDOM } from "jsdom";
import type { NavItem } from "../types/NavItem";
import { getConfig } from "./getConfig";
import { getRepoLink } from "./getRepoLink";

export async function getNav(navItems: NavItem[]) {
  let { name, root, contentDir, backstory, nav } = await getConfig();
  let s = "",
    navContent = "";

  if (nav) {
    try {
      navContent = await (await fetch(nav)).text();
    } catch {
      console.warn(`Failed to fetch content from '${nav}'`);
    }
  }

  if (navContent) {
    let navDom = new JSDOM(navContent).window.document.body;

    for (let link of navDom.querySelectorAll("a")) {
      if (link.dataset.name === name) {
        let parent = link.parentElement;

        link.remove();

        while (parent && parent.innerHTML.trim() === "") {
          let nextParent = parent.parentElement;

          parent.remove();
          parent = nextParent;
        }
      }
    }

    navContent = navDom.innerHTML;
  }

  if (navItems.length > 1) {
    for (let { id, title, items } of navItems) {
      s += `\n<li data-id="${id}"><a href="${root}${contentDir}/${id}">${title}</a></li>`;

      if (items.length !== 0) {
        s += "\n  <ul>";

        for (let { title } of items) s += `\n    <li>${title}</li>`;

        s += "\n  </ul>\n";
      }

      s += "</li>";
    }
  }

  if (!s && !navContent) return "";

  let repoLink = await getRepoLink();

  s = s.trim() ? `<section><ul>${s}\n</ul></section>` : "";
  s = `${s}
<section class="ref">
  <ul>
    <li>${repoLink}</li>
    ${backstory ? `<li><a href="${backstory}">Backstory</a></li>` : ""}
  </ul>
</section>
${navContent}`;

  return `<nav>\n${s}\n</nav>`;
}
