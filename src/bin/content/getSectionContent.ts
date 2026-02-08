import type { Context } from "../../types/Context.ts";
import { escapeHTML } from "../../utils/escapeHTML.ts";
import { escapeRegExp } from "../../utils/escapeRegExp.ts";
import { getRepoLink } from "../getRepoLink.ts";
// import { getRepoMetadata } from "../getRepoMetadata.ts";
import { getParsedContent } from "../parsing/getParsedContent.ts";
import { stripHTML } from "../stripHTML.ts";
import { getCounterContent } from "./getCounterContent.ts";
import { getCSSRoot } from "./getCSSRoot.ts";
import { getDefaultCodeStyleContent } from "./getDefaultCodeStyleContent.ts";
import { getIconTag } from "./getIconTag.ts";
import { getInjectedContent } from "./getInjectedContent.ts";
import { getInstallationContent } from "./getInstallationContent.ts";
import { getMainTitle } from "./getMainTitle.ts";
import { getNav } from "./getNav.ts";
import { getPlainTitle } from "./getPlainTitle.ts";
import { toFileContent } from "./toFileContent.ts";
import { tweakTypography } from "./tweakTypography.ts";

export async function getSectionContent(ctx: Context, index: number) {
  let { root, contentDir = "" } = ctx;
  // let repoDescription =
  //   index === 0 ? (await getRepoMetadata(ctx)).description : "";
  let descriptionContent = escapeHTML(tweakTypography(ctx.description));

  let cssRoot = await getCSSRoot(ctx, "content");
  let { sections, nav } = await getParsedContent(ctx);

  let content = sections[index];
  let navContent = await getNav(ctx, nav);

  let mainTitle = await getMainTitle(ctx);
  let plainTitle = await getPlainTitle(ctx);

  return toFileContent(`
<!DOCTYPE html>
<html lang="en" data-layout="section" data-section="${index}">
<head>
  ${getInjectedContent(ctx, "section", "head", "prepend")}
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${plainTitle}: ${escapeHTML(stripHTML(nav[index]?.title, true))}">
  <title>${escapeHTML(stripHTML(nav[index]?.title, true))} | ${plainTitle}</title>
  <link rel="stylesheet" href="${cssRoot}/base.css">
  <link rel="stylesheet" href="${cssRoot}/section.css">
  ${getIconTag(ctx)}
  ${nav[index + 1]?.id ? `<link rel="prefetch" href="${root}${contentDir}/${nav[index + 1]?.id}">` : ""}
  ${nav[index - 1]?.id ? `<link rel="prefetch" href="${root}${contentDir}/${nav[index - 1]?.id}">` : ""}
  ${getInjectedContent(ctx, "section", "head", "append")}
</head>
<body>
${getInjectedContent(ctx, "section", "body", "prepend")}
<div class="layout">
<header>
  <h1>${mainTitle}</h1>
  <div class="description">
    <p>${descriptionContent}</p>
  </div>
</header>
<div class="${navContent ? "" : "no-nav "}body">
<main>
${content}

<p class="pagenav">
  ${nav[index - 1]?.id ? `<span class="prev"><span class="icon">←</span> <a href="${root}${contentDir}/${nav[index - 1]?.id}">${nav[index - 1]?.title}</a></span>\n  <span class="sep">|</span>` : ""}
  ${nav[index + 1]?.id ? `<span class="next"><a href="${root}${contentDir}/${nav[index + 1]?.id}">${nav[index + 1]?.title}</a> <span class="icon">→</span></span>` : `<span class="repo">${getRepoLink(ctx)}</span>`}
</p>
</main>
<hr>
<aside class="aux">
  <div class="header" hidden>
    <h1>${mainTitle}</h1>
    <div class="description">
      <p>${descriptionContent}</p>
      <p class="installation">${await getInstallationContent(ctx)}</p>
    </div>
  </div>
${navContent.replace(
  new RegExp(
    `(<li data-id="${escapeRegExp(nav[index]?.id)}">)<a href="[^"]+">([^<]+)</a>`,
  ),
  "$1<strong>$2</strong>",
)}
</aside>
</div>
</div>

${
  content.includes("<pre><code ")
    ? getInjectedContent(ctx, "section", ":has-code", "append") ||
      getDefaultCodeStyleContent(cssRoot)
    : ""
}
${getCounterContent(ctx)}
${getInjectedContent(ctx, "section", "body", "append")}
</body>
</html>
  `);
}
