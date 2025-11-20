import { JSDOM } from "jsdom";
import Markdown from "markdown-it";
import type { Context } from "../../types/Context";
import { fetchContent } from "../fetchContent";
import { getLocation } from "../getLocation";
import { buildNav } from "./buildNav";
import { getInstallationCode } from "./getInstallationCode";
import { getSectionPostprocess } from "./getSectionPostprocess";
import { isBadgeContainer } from "./isBadgeContainer";
import { joinLines } from "./joinLines";
import { preprocessContent } from "./preprocessContent";

const md = new Markdown({
  html: true,
});

export async function getParsedContent(ctx: Context) {
  let { singlePage, linkMap } = ctx;
  let rawContent = await fetchContent(
    getLocation(ctx, "README.md", ctx.source),
  );
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
      title = element.innerHTML;
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

    if (element.matches("p") && description.length === 0) {
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

  if (
    intro.length !== 0 &&
    description.length !== 0 &&
    !description[0].startsWith("<p><em>")
  ) {
    intro.unshift(description[0]);
    description = [];
  }

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

  return {
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
}
