import { exec as defaultExec } from "node:child_process";
import { access, cp, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";
import { packageName } from "../const/packageName";
import type { Context } from "../types/Context";
import { escapeHTML } from "../utils/escapeHTML";
import { escapeRegExp } from "../utils/escapeRegExp";
import { getCounterContent } from "./getCounterContent";
import { getIcon } from "./getIcon";
import { getInjectedContent } from "./getInjectedContent";
import { getNav } from "./getNav";
import { getRepoLink } from "./getRepoLink";
import { getTitle } from "./getTitle";
import { getParsedContent } from "./parsing/getParsedContent";
import { stripHTML } from "./stripHTML";
import { toFileContent } from "./toFileContent";

const exec = promisify(defaultExec);

export async function setContent(ctx: Context) {
  let {
    dir = "",
    assetsDir,
    baseColor,
    theme,
    root,
    contentDir = "",
    name,
    title,
    description: packageDescription,
    backstory,
    redirect,
  } = ctx;

  let counterContent = getCounterContent(ctx);
  let escapedName = escapeHTML(name);
  let escapedTitle = title ? escapeHTML(title) : escapedName;
  let escapedPackageDescription = escapeHTML(packageDescription);

  let rootAttrs = "";
  let cssRoot = "";

  if (assetsDir) {
    cssRoot = assetsDir;

    await cp(join(__dirname, "css"), cssRoot, { force: true, recursive: true });
  } else {
    let packageVersion = (await exec(`npm view ${packageName} version`)).stdout
      .trim()
      .split(".")
      .slice(0, 2)
      .join(".");

    let packageUrl = `https://unpkg.com/${packageName}@${packageVersion}`;

    cssRoot = `${packageUrl}/dist/css`;
  }

  let defaultCodeStyleContent = `
<link rel="stylesheet" href="https://unpkg.com/@highlightjs/cdn-assets@11.11.1/styles/base16/material.min.css">
<link rel="stylesheet" href="${cssRoot}/code.css">
<script src="https://unpkg.com/@highlightjs/cdn-assets@11.11.1/highlight.min.js"></script>
<script>hljs.highlightAll()</script>
  `.trim();

  if (theme) rootAttrs += ` data-theme="${escapeHTML(theme)}"`;

  if (baseColor) rootAttrs += ` style="--base-color: ${escapeHTML(baseColor)}"`;

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
    badges,
    description,
    descriptionNote,
    intro,
    features,
    note,
    installation,
    sections,
    nav,
  } = await getParsedContent(ctx);

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
  <meta name="description" content="${escapedTitle}: ${escapeHTML(stripHTML(nav[i]?.title))}">
  <title>${escapeHTML(stripHTML(nav[i]?.title))} | ${escapedTitle}</title>
  <link rel="stylesheet" href="${cssRoot}/base.css">
  <link rel="stylesheet" href="${cssRoot}/section.css">
  ${iconTag}
  ${nav[i + 1]?.id ? `<link rel="prefetch" href="${root}${contentDir}/${nav[i + 1]?.id}">` : ""}
  ${nav[i - 1]?.id ? `<link rel="prefetch" href="${root}${contentDir}/${nav[i - 1]?.id}">` : ""}
  ${getInjectedContent(ctx, "section", "head")}
</head>
<body>
<div class="layout">
<div class="${navContent ? "" : "no-nav "}body">
<main>
<h1>${getTitle(ctx, { withPackageURL: true })}</h1>
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
    ? getInjectedContent(ctx, "section", ":has-code") || defaultCodeStyleContent
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
  <meta name="description" content="${escapedTitle}${escapedPackageDescription ? `: ${escapedPackageDescription}` : ""}">
  <title>${escapedTitle}${escapedPackageDescription ? ` | ${escapedPackageDescription}` : ""}</title>
  <link rel="stylesheet" href="${cssRoot}/base.css">
  <link rel="stylesheet" href="${cssRoot}/index.css">
  ${iconTag}
  <link rel="prefetch" href="${root}start">
  ${nav[0] ? `<link rel="prefetch" href="${root}${contentDir}/${nav[0]?.id ?? ""}">` : ""}
  ${getInjectedContent(ctx, "index", "head")}
</head>
<body>
<div class="layout">
<main>
<section class="intro-title">
  <div class="section-content">
    <div class="badges">
      ${badges}
    </div>
    <h1>${getTitle(ctx, { cover: true })}</h1>
    <div class="description">
      ${description || (escapedPackageDescription ? `<p><em>${escapedPackageDescription}</em><p>` : "")}
      ${descriptionNote}
    </div>
    <p class="actions">
      <a href="${root}start" class="primary button">Docs</a>
      <span class="sep"> • </span>
      ${getRepoLink(ctx, "button")}
    </p>
    ${backstory ? `<p class="ref"><a href="${backstory}">Backstory</a></p>` : ""}
    <p class="installation"><code>${installation}</code></p>
  </div>
  <script>document.querySelectorAll(".badges img").forEach(img=>{let c=img.closest(".badge");if(c){if(img.complete)c.classList.add("loaded");else{img.onload=()=>{c.classList.add("loaded");};img.onerror=()=>{c.classList.add("failed");};}}});</script>
</section>
${
  intro || features || note
    ? `
<section class="intro">
  <div class="section-content">
    ${intro ? `<div class="intro">${intro}</div>` : ""}
    ${features ? `<div class="features">${features}</div>` : ""}
    ${note ? `<div class="note">${note}</div>` : ""}
  </div>
</section>
`
    : ""
}
</main>
</div>

${
  [description, intro, features, note].some((s) => s.includes("<pre><code "))
    ? getInjectedContent(ctx, "index", ":has-code") || defaultCodeStyleContent
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
  <title>${escapedTitle}</title>
  <link rel="stylesheet" href="${cssRoot}/base.css">
  ${iconTag}
  <script>window.location.replace("${root}${contentDir}/${nav[0]?.id}");</script>
  ${getInjectedContent(ctx, "start", "head")}
</head>
<body>
<div class="layout">
  <h1>${escapedTitle}</h1>
</div>

${counterContent}
${getInjectedContent(ctx, "start", "body")}
</body>
</html>
            `),
    ),
  ]);
}
