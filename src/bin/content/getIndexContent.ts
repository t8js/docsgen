import type { Context } from "../../types/Context.ts";
import { escapeHTML } from "../../utils/escapeHTML.ts";
import { getRepoLink } from "../getRepoLink.ts";
import { getRepoMetadata } from "../getRepoMetadata.ts";
import { getParsedContent } from "../parsing/getParsedContent.ts";
import { getCounterContent } from "./getCounterContent.ts";
import { getCSSRoot } from "./getCSSRoot.ts";
import { getDefaultCodeStyleContent } from "./getDefaultCodeStyleContent.ts";
import { getIconTag } from "./getIconTag.ts";
import { getInjectedContent } from "./getInjectedContent.ts";
import { getMainTitle } from "./getMainTitle.ts";
import { getPlainTitle } from "./getPlainTitle.ts";
import { toFileContent } from "./toFileContent.ts";
import { tweakTypography } from "./tweakTypography.ts";

export async function getIndexContent(ctx: Context) {
  let {
    root,
    contentDir = "",
    description: packageDescription,
    backstory,
  } = ctx;

  let counterContent = getCounterContent(ctx);
  let escapedPackageDescription = escapeHTML(packageDescription);
  let repoDescription = (await getRepoMetadata(ctx)).description;

  let { description, nav } = await getParsedContent(ctx);
  let descriptionContent = escapeHTML(tweakTypography(repoDescription || description));

  let plainTitle = await getPlainTitle(ctx);
  let cssRoot = await getCSSRoot(ctx, "index");

  let links = [
    `<a href="${root}start" class="primary">Docs</a>`,
    getRepoLink(ctx),
    backstory ? `<a href="${backstory}">Backstory</a>` : "",
  ].filter(x => x !== "");

  let sep = '&nbsp;<span class="sep">·</span> ';

  return toFileContent(`
<!DOCTYPE html>
<html lang="en" data-layout="index" class="aux">
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
<h1>${await getMainTitle(ctx)}</h1>
<p class="description">${descriptionContent}</p>
${links.length === 0 ? "" : `<p class="links">${links.join(sep)}</p>`}
</main>
</div>
${
  [descriptionContent].some((s) => s.includes("<pre><code "))
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
