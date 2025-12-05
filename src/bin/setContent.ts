import { exec as defaultExec } from "node:child_process";
import { access, cp, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { packageName } from "../const/packageName.ts";
import type { Context } from "../types/Context.ts";
import { escapeHTML } from "../utils/escapeHTML.ts";
import { escapeRegExp } from "../utils/escapeRegExp.ts";
import { getCounterContent } from "./getCounterContent.ts";
import { getIcon } from "./getIcon.ts";
import { getInjectedContent } from "./getInjectedContent.ts";
import { getNav } from "./getNav.ts";
import { getRepoLink } from "./getRepoLink.ts";
import { getParsedContent } from "./parsing/getParsedContent.ts";
import { stripHTML } from "./stripHTML.ts";
import { toFileContent } from "./toFileContent.ts";

const exec = promisify(defaultExec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getDefaultCodeStyleContent(cssRoot: string) {
  return `
<link rel="stylesheet" href="https://unpkg.com/@highlightjs/cdn-assets@11.11.1/styles/stackoverflow-light.min.css" media="(prefers-color-scheme: light)">
<link rel="stylesheet" href="https://unpkg.com/@highlightjs/cdn-assets@11.11.1/styles/base16/material.min.css" media="(prefers-color-scheme: dark)">
<link rel="stylesheet" href="${cssRoot}/code.css">
<script src="https://unpkg.com/@highlightjs/cdn-assets@11.11.1/highlight.min.js"></script>
<script>hljs.highlightAll()</script>
    `.trim();
}

function tweakTypography(s = "") {
  return s
    .replace(/\b(for|in|on|at|to|with|a|an|the|its)\s+/gi, "$1\xa0")
    .replace(/\b(React)\s+(apps?)\b/gi, "$1\xa0$2");
}

export async function setContent(ctx: Context) {
  let {
    dir = "",
    assetsDir,
    baseColor,
    linkColor,
    theme,
    root,
    contentDir = "",
    name,
    title,
    htmlTitle,
    description: packageDescription,
    backstory,
    redirect,
  } = ctx;

  let counterContent = getCounterContent(ctx);
  let escapedPackageDescription = escapeHTML(packageDescription);

  let rootAttrs = "";
  let cssRoot = {
    index: "",
    content: "",
  };

  if (assetsDir) {
    cssRoot.index = assetsDir;
    cssRoot.content = `../${assetsDir}`;

    await cp(join(__dirname, "css"), join(dir, cssRoot.index), {
      force: true,
      recursive: true,
    });
  } else {
    let packageVersion = (await exec(`npm view ${packageName} version`)).stdout
      .trim()
      .split(".")
      .slice(0, 2)
      .join(".");

    let packageUrl = `https://unpkg.com/${packageName}@${packageVersion}`;

    cssRoot.index = `${packageUrl}/dist/css`;
    cssRoot.content = `${packageUrl}/dist/css`;
  }

  if (theme) rootAttrs += ` data-theme="${escapeHTML(theme)}"`;

  let rootStyle = "";

  if (baseColor)
    rootStyle += `${rootStyle ? " " : ""}--base-color: ${escapeHTML(baseColor)};`;
  if (linkColor)
    rootStyle += `${rootStyle ? " " : ""}--link-color: ${escapeHTML(linkColor)};`;

  if (rootStyle) rootAttrs += ` style="${rootStyle}"`;

  let icon = getIcon(ctx);
  let iconTag = icon.url
    ? `<link rel="icon"${icon.type ? ` type="${icon.type}"` : ""} href="${icon.url}">`
    : "";

  if (redirect) {
    let escapedRedirect = escapeHTML(redirect);

    await writeFile(
      join(dir, "index.html"),
      toFileContent(`
<!DOCTYPE html>
<html lang="en" class="blank"${rootAttrs}>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <meta http-equiv="refresh" content="0; URL=${escapedRedirect}">
  ${iconTag}
  ${getInjectedContent(ctx, "redirect", "head")}
</head>
<body>
${counterContent}
${getInjectedContent(ctx, "redirect", "body")}
<script>window.location.replace("${escapedRedirect}");</script>
</body>
</html>
            `),
    );

    return;
  }

  let {
    title: parsedTitle,
    description,
    intro,
    features,
    note,
    installation,
    sections,
    nav,
  } = await getParsedContent(ctx);

  let plainTitle = escapeHTML(title || stripHTML(htmlTitle || parsedTitle, true) || name);
  let coverTitle = htmlTitle || parsedTitle || plainTitle;

  let descriptionContent =
    tweakTypography(description) ||
    (escapedPackageDescription
      ? `<p>${tweakTypography(escapedPackageDescription)}<p>`
      : "");

  let navContent = await getNav(ctx, nav);
  let dirs = [contentDir];

  await Promise.all(
    dirs.map(async (path) => {
      let dirPath = join(dir, path);

      try {
        await access(dirPath);
      } catch {
        await mkdir(dirPath);
      }
    }),
  );

  await Promise.all([
    ...sections.map(async (content, i) =>
      writeFile(
        join(dir, contentDir, `${nav[i]?.id ?? `_untitled_${i}`}.html`),
        toFileContent(`
<!DOCTYPE html>
<html lang="en"${rootAttrs}>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${plainTitle}: ${escapeHTML(stripHTML(nav[i]?.title, true))}">
  <title>${escapeHTML(stripHTML(nav[i]?.title, true))} | ${plainTitle}</title>
  <link rel="stylesheet" href="${cssRoot.content}/base.css">
  <link rel="stylesheet" href="${cssRoot.content}/section.css">
  ${iconTag}
  ${nav[i + 1]?.id ? `<link rel="prefetch" href="${root}${contentDir}/${nav[i + 1]?.id}">` : ""}
  ${nav[i - 1]?.id ? `<link rel="prefetch" href="${root}${contentDir}/${nav[i - 1]?.id}">` : ""}
  ${getInjectedContent(ctx, "section", "head")}
</head>
<body>
<div class="layout">
<div class="${navContent ? "" : "no-nav "}body">
<main>
<h1><a href="${root}">${coverTitle}</a></h1>
${content}

<p class="pagenav">
  <span class="prev">
    <span class="icon">←</span>
    ${nav[i - 1]?.id ? `<a href="${root}${contentDir}/${nav[i - 1]?.id}">${nav[i - 1]?.title}</a>` : `<a href="${root}">Intro</a>`}
  </span>
  <span class="sep">|</span>
  ${nav[i + 1]?.id ? `<span class="next"><a href="${root}${contentDir}/${nav[i + 1]?.id}">${nav[i + 1]?.title}</a> <span class="icon">→</span></span>` : `<span class="repo next">${getRepoLink(ctx)} <span class="icon">✦</span></span>`}
</p>
</main>
${navContent ? "<hr>" : ""}
${navContent.replace(
  new RegExp(
    `(<li data-id="${escapeRegExp(nav[i]?.id)}">)<a href="[^"]+">([^<]+)</a>`,
  ),
  "$1<strong>$2</strong>",
)}
</div>
</div>

${
  content.includes("<pre><code ")
    ? getInjectedContent(ctx, "section", ":has-code") ||
      getDefaultCodeStyleContent(cssRoot.content)
    : ""
}
${counterContent}
${getInjectedContent(ctx, "section", "body")}
</body>
</html>
        `),
      ),
    ),
    writeFile(
      join(dir, "index.html"),
      toFileContent(`
<!DOCTYPE html>
<html lang="en"${rootAttrs}>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${plainTitle}${escapedPackageDescription ? `: ${escapedPackageDescription}` : ""}">
  <title>${plainTitle}${escapedPackageDescription ? ` | ${escapedPackageDescription}` : ""}</title>
  <link rel="stylesheet" href="${cssRoot.index}/base.css">
  <link rel="stylesheet" href="${cssRoot.index}/index.css">
  ${iconTag}
  <link rel="prefetch" href="${root}start">
  ${nav[0] ? `<link rel="prefetch" href="${root}${contentDir}/${nav[0]?.id ?? ""}">` : ""}
  ${getInjectedContent(ctx, "index", "head")}
</head>
<body>
<div class="layout">
<main>
<section class="b1 intro-title">
  <div class="section-content">
    <h1>${coverTitle}</h1>
    <div class="description">
      ${descriptionContent}
    </div>
    <p class="actions">
      <a href="${root}start" class="primary">Docs</a>
      <span class="sep"> • </span>
      ${getRepoLink(ctx)}
    </p>
    ${backstory ? `<p class="ref"><a href="${backstory}">Backstory</a></p>` : ""}
    <p class="installation"><code>${installation}</code></p>
  </div>
</section>
${
  intro || features || note
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
    ? getInjectedContent(ctx, "index", ":has-code") ||
      getDefaultCodeStyleContent(cssRoot.index)
    : ""
}
${counterContent}
${getInjectedContent(ctx, "index", "body")}
</body>
</html>
            `),
    ),
    writeFile(
      join(dir, "start.html"),
      toFileContent(`
<!DOCTYPE html>
<html lang="en" class="blank"${rootAttrs}>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <meta http-equiv="refresh" content="0; URL=${root}${contentDir}/${nav[0]?.id}">
  <title>${plainTitle}</title>
  <link rel="stylesheet" href="${cssRoot.index}/base.css">
  ${iconTag}
  <script>window.location.replace("${root}${contentDir}/${nav[0]?.id}");</script>
  ${getInjectedContent(ctx, "start", "head")}
</head>
<body>
<div class="layout">
  <h1>${plainTitle}</h1>
</div>

${counterContent}
${getInjectedContent(ctx, "start", "body")}
</body>
</html>
            `),
    ),
  ]);
}
