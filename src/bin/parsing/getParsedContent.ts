import { JSDOM } from "jsdom";
import Markdown from "markdown-it";
import type { Context } from "../../types/Context.ts";
import { fetchContent } from "../fetchContent.ts";
import { getLocation } from "../getLocation.ts";
import { buildNav } from "./buildNav.ts";
import { getInstallationCode } from "./getInstallationCode.ts";
import { getSectionPostprocess } from "./getSectionPostprocess.ts";
import { isBadgeContainer } from "./isBadgeContainer.ts";
import { joinLines } from "./joinLines.ts";
import { preprocessContent } from "./preprocessContent.ts";
import { NavItem } from "../../types/NavItem.ts";

export type ParsedContent = {
  badges: string;
  title: string;
  description: string;
  intro: string;
  features: string;
  note: string;
  installation: string;
  sections: string[];
  nav: NavItem[];
};

const md = new Markdown({
  html: true,
});

const parsedContentCache = new Map<string, ParsedContent>();

export async function getParsedContent(ctx: Context): Promise<ParsedContent> {
  let contentLocation = getLocation(ctx, "README.md", ctx.source);
  let parsedContent = parsedContentCache.get(contentLocation);

  if (parsedContent) return parsedContent;

  let { singlePage, firstLineDescription, linkMap } = ctx;

  let rawContent = await fetchContent(contentLocation);
  let content = md.render(preprocessContent(rawContent));
  let dom = new JSDOM(content);

  let { nav, linkMap: navLinkMap } = buildNav(ctx, dom);

  let badges = "";
  let title = "";
  let description: string[] = [];
  let intro: string[] = [];
  let features: string[] = [];
  let note: string[] = [];
  let installation = "";

  let section: string[] = [];
  let sections: string[] = [];

  let hasFeatures = false;
  let indexComplete = false;

  for (let element of dom.window.document.body.children) {
    if (isBadgeContainer(element)) {
      badges = element.outerHTML;
      continue;
    }

    if (element.matches("h1")) {
      title = element.innerHTML.trim();
      continue;
    }

    if (element.matches("h2")) {
      if (!indexComplete) indexComplete = true;

      if (!singlePage && section.length !== 0) {
        sections.push(joinLines(section));
        section = [];
      }
    }

    let { outerHTML } = element;

    if (indexComplete) {
      section.push(outerHTML);
      continue;
    }

    if (hasFeatures) {
      let installationCode = getInstallationCode(element);

      if (installationCode) installation = installationCode;
      else note.push(outerHTML);

      continue;
    }

    if (element.matches("ul")) {
      hasFeatures = true;
      features.push(outerHTML);
      continue;
    }

    let installationCode = getInstallationCode(element);

    if (installationCode) {
      installation = installationCode;
      continue;
    }

    if (
      title &&
      firstLineDescription &&
      element.matches("p") &&
      description.length === 0
    ) {
      description.push(outerHTML);
      continue;
    }

    intro.push(outerHTML);
  }

  if (section.length !== 0) sections.push(joinLines(section));

  let postprocess = getSectionPostprocess({
    ...navLinkMap,
    ...linkMap,
  });

  if (intro.at(-1) === "<hr>") intro.pop();

  for (let i = 0; i < intro.length; i++) {
    if (
      intro[i].includes("<br>") &&
      intro[i].startsWith("<p>") &&
      intro[i].endsWith("</p>")
    ) {
      let s = intro[i]
        .slice(3, -4)
        .replace(/<br>(\r?\n)?(\s*)/g, '</span><br>$1$2<span class="li">');

      intro[i] = `<p><span class="li">${s}</span></p>`;
    }
  }

  parsedContent = {
    badges, // postprocessBadges(joinLines(badges)),
    title,
    description: joinLines(description),
    intro: joinLines(intro),
    features: joinLines(features),
    note: joinLines(note),
    installation,
    sections: sections.map(postprocess),
    nav,
  };

  parsedContentCache.set(contentLocation, parsedContent);

  return parsedContent;
}
