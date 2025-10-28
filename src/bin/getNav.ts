import { JSDOM } from "jsdom";
import type { Context } from "../types/Context";
import type { NavItem } from "../types/NavItem";
import { fetchContent } from "./fetchContent";
import { getRepoLink } from "./getRepoLink";

export async function getNav(ctx: Context, navItems: NavItem[]) {
  let { name, root, contentDir, backstory, nav } = ctx;
  let navContent = await fetchContent(nav);
  let s = "";

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

  let navItemCount = 0;

  if (navItems.length === 1) {
    let { id, items } = navItems[0];
    let itemLink = `${root}${contentDir}/${encodeURIComponent(id)}`;

    for (let { id, title } of items) {
      s += `\n<li><a href="${itemLink}#${encodeURIComponent(id)}">${title}</a></li>`;
      navItemCount++;
    }
  } else {
    for (let { id, title, items } of navItems) {
      let itemLink = `${root}${contentDir}/${encodeURIComponent(id)}`;

      s += `\n<li data-id="${id}"><a href="${itemLink}">${title}</a>`;

      if (items.length !== 0) {
        s += "\n  <ul>";

        for (let { id, title } of items) {
          s += `\n    <li><a href="${itemLink}#${encodeURIComponent(id)}">${title}</a></li>`;
          navItemCount++;
        }

        s += "\n  </ul>\n";
      }

      s += "</li>";
      navItemCount++;
    }
  }

  if ((!s || navItemCount < 2) && !navContent) return "";

  s = s.trim();
  s = s ? `<p class="title">Contents</p>\n<ul>${s}\n</ul>\n` : "";

  let repoLink = getRepoLink(ctx);

  if (repoLink || backstory)
    s += `
<p class="title">Resources</p>
<ul>
  ${repoLink ? `<li>${repoLink}</li>` : ""}
  ${backstory ? `<li><a href="${backstory}">Backstory</a></li>` : ""}
</ul>
`;

  s = s.trim();
  s = s ? `<section>\n${s}\n</section>` : "";

  return `<nav class="b1">\n${s}\n${navContent}\n</nav>`;
}
