import { JSDOM } from "jsdom";
import Markdown from "markdown-it";
import type { Context } from "../types/Context";
import type { NavItem } from "../types/NavItem";
import { fetchText } from "./fetchText";
import { getLocation } from "./getLocation";
import { getSlug } from "./getSlug";

const md = new Markdown({
  html: true,
});

function joinLines(x: string[]) {
  return x.join("\n").trim();
}

function buildNav(ctx: Context, dom: JSDOM) {
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

    if (!isSectionTitle) link += `#${slug}`;

    linkMap[`#${slug}`] = link;

    if (singlePage && isSectionTitle) {
      if (navItem) {
        element.id = slug;
        navItem.items.push({
          id: slug,
          title: element.innerHTML.trim(),
        });
      }
    } else if (isSectionTitle) {
      element.id = slug;

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

function getInstallationCode(element: Element) {
  return element
    .querySelector("code")
    ?.innerHTML.trim()
    .match(/(\S\s*)?(npm (i|install) .*)/)?.[2];
}

function getSectionPostprocess(linkMap: Record<string, string | undefined>) {
  return (content: string) => {
    let s = content;

    s = s.replace(/<a href="([^"]+)">/g, (_, url) => {
      let nextURL = linkMap[url] ?? url;
      let attrs = /^(https?:)?\/\//.test(nextURL) ? " target=\"_blank\"" : "";

      return `<a href="${nextURL}"${attrs}>`;
    });

    return s;
  };
}

function postprocessBadges(content: string) {
  let { document } = new JSDOM(content).window;

  for (let img of document.querySelectorAll("img")) {
    let parent = img.parentElement;

    if (!parent) continue;

    let container = document.createElement("span");
    container.className = "badge";

    parent.insertBefore(container, img);
    container.append(img);
  }

  return document.body.innerHTML;
}

export async function getParsedContent(ctx: Context) {
  let { singlePage, linkMap } = ctx;
  let rawContent = await fetchText(getLocation(ctx, "README.md", ctx.source));
  let content = md.render(rawContent);
  let dom = new JSDOM(content);

  let { nav, linkMap: navLinkMap } = buildNav(ctx, dom);

  let badges: string[] = [];
  let title = "";
  let description: string[] = [];
  let features: string[] = [];
  let note: string[] = [];
  let installation = "";

  let section: string[] = [];
  let sections: string[] = [];

  let hasTitle = false;
  let hasFeatures = false;
  let indexComplete = false;

  let element = dom.window.document.body.firstElementChild;

  while (element !== null) {
    if (element.matches("h1")) hasTitle = true;
    else {
      if (element.matches("h2")) {
        if (!indexComplete) indexComplete = true;

        if (!singlePage && section.length !== 0) {
          sections.push(joinLines(section));
          section = [];
        }
      }

      let { outerHTML } = element;

      if (indexComplete) section.push(outerHTML);
      else if (!hasTitle) {
        badges.push(outerHTML);
      } else if (!hasFeatures) {
        if (element.matches("ul")) {
          hasFeatures = true;
          features.push(outerHTML);
        } else {
          let installationCode = getInstallationCode(element);

          if (installationCode) installation = installationCode;
          else description.push(outerHTML);
        }
      } else {
        let installationCode = getInstallationCode(element);

        if (installationCode) installation = installationCode;
        else note.push(outerHTML);
      }
    }

    element = element.nextElementSibling;
  }

  if (section.length !== 0) sections.push(joinLines(section));

  let postprocess = getSectionPostprocess({
    ...navLinkMap,
    ...linkMap,
  });

  return {
    badges: postprocessBadges(joinLines(badges)),
    title,
    description: joinLines(description),
    features: joinLines(features),
    note: joinLines(note),
    installation,
    sections: sections.map(postprocess),
    nav,
  };
}
