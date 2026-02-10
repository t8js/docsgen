import type { Context } from "../../types/Context.ts";
import { escapeHTML } from "../../utils/escapeHTML.ts";
import { getRepoLink } from "../getRepoLink.ts";
import { getParsedContent } from "../parsing/getParsedContent.ts";
import { getCounterContent } from "./getCounterContent.ts";
import { getCSSRoot } from "./getCSSRoot.ts";
import { getDefaultCodeStyleContent } from "./getDefaultCodeStyleContent.ts";
import { getDescriptionContent } from "./getDescriptionContent.ts";
import { getIconTag } from "./getIconTag.ts";
import { getInjectedContent } from "./getInjectedContent.ts";
import { getInstallationContent } from "./getInstallationContent.ts";
import { getMainTitle } from "./getMainTitle.ts";
import { getPlainTitle } from "./getPlainTitle.ts";
import { toFileContent } from "./toFileContent.ts";

export async function getIndexContent(ctx: Context, hideIntro = false) {
  let {
    root,
    contentDir = "",
    description: packageDescription,
    backstory,
  } = ctx;

  let counterContent = getCounterContent(ctx);
  let escapedPackageDescription = escapeHTML(packageDescription);

  let { description, intro, features, note, nav } = await getParsedContent(ctx);

  let plainTitle = await getPlainTitle(ctx);
  let cssRoot = await getCSSRoot(ctx, "index");

  return toFileContent(`
<!DOCTYPE html>
<html lang="en" data-layout="index">
<head>
  ${getInjectedContent(ctx, "index", "head", "prepend")}
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${plainTitle}${escapedPackageDescription ? `: ${escapedPackageDescription}` : ""}">
  <title>${plainTitle}${escapedPackageDescription ? ` | ${escapedPackageDescription}` : ""}</title>
  <link rel="stylesheet" href="${cssRoot}/base.css">
  <link rel="stylesheet" href="${cssRoot}/index.css">
  ${getIconTag(ctx)}
  <link rel="prefetch" href="${root}start">
  ${nav[0] ? `<link rel="prefetch" href="${root}${contentDir}/${nav[0]?.id ?? ""}">` : ""}
  ${getInjectedContent(ctx, "index", "head", "append")}
</head>
<body>
${getInjectedContent(ctx, "index", "body", "prepend")}
<div class="layout">
<main>
<section class="aux intro-title">
  <div class="section-content">
    ${getInjectedContent(ctx, "index", "cover", "prepend")}
    <h1>${await getMainTitle(ctx)}</h1>
    <div class="description">
      ${await getDescriptionContent(ctx)}
    </div>
    <p class="actions">
      <a href="${root}start" class="primary">Docs</a>
      <span class="sep"> • </span>
      ${getRepoLink(ctx)}
    </p>
    ${backstory ? `<p class="ref"><a href="${backstory}">Backstory</a></p>` : ""}
    <p class="installation">${await getInstallationContent(ctx)}</p>
    ${getInjectedContent(ctx, "index", "cover", "append")}
  </div>
</section>
${
  !hideIntro && (intro || features || note)
    ? `
<section class="intro">
  <div class="section-content">
    ${intro ? `<div class="intro">${intro}</div>` : ""}
    ${features ? `<div class="features">${features}</div>` : ""}
    ${note ? `<div class="note">${note}</div>` : ""}
    <p class="pagenav">
      <span class="next"><a href="${root}start">To the docs</a> <span class="icon">→</span></span>
    </p>
  </div>
</section>
`
    : ""
}
</main>
</div>

${
  [description, intro, features, note].some((s) => s.includes("<pre><code "))
    ? getInjectedContent(ctx, "index", ":has-code", "append") ||
      getDefaultCodeStyleContent(cssRoot)
    : ""
}
${counterContent}
${getInjectedContent(ctx, "index", "body", "append")}
</body>
</html>
  `);
}
