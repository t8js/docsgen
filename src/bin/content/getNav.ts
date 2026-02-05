import { JSDOM } from "jsdom";
import type { Context } from "../../types/Context.ts";
import type { NavItem } from "../../types/NavItem.ts";
import { fetchContent } from "../fetchContent.ts";
import { getNpmLink } from "../getNpmLink.ts";
import { getRepoLink } from "../getRepoLink.ts";

let cachedNavContent = new Map<string, string>();

async function getNavContent({ name, nav }: Context) {
  if (!nav) return "";

  let navContent = cachedNavContent.get(nav);

  if (navContent !== undefined) return navContent;

  navContent = await fetchContent(nav);

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

  cachedNavContent.set(nav, navContent);

  return navContent;
}

export async function getNav(ctx: Context, navItems: NavItem[]) {
  let { name, root, contentDir, backstory } = ctx;
  let navContent = await getNavContent(ctx);
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
  let npmLink = getNpmLink(ctx);

  if (repoLink || npmLink || backstory)
    s += `
<p class="title">Resources</p>
<ul>
  ${repoLink ? `<li>${repoLink}</li>` : ""}
  ${npmLink ? `<li>${npmLink}</li>` : ""}
  ${backstory ? `<li><a href="${backstory}">Backstory</a></li>` : ""}
</ul>
`;

  s = s.trim();
  s = s ? `<section>\n${s}\n</section>` : "";

  return `<nav class="aux">\n${s}\n${navContent}\n</nav>`;
}
