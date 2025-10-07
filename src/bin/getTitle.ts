import type { Context } from "../types/Context";
import { escapeHTML } from "../utils/escapeHTML";

type GetTitleParams = {
  cover?: boolean;
  originalContent?: string;
  withPackageURL?: boolean;
};

export function getTitle(
  ctx: Context,
  { cover, originalContent, withPackageURL }: GetTitleParams = {},
) {
  let { root, name, title: packageTitle, scope, theme } = ctx;

  if (originalContent && ![name, packageTitle].includes(originalContent.trim()))
    return originalContent;

  if (packageTitle) {
    let escapedTitle = escapeHTML(packageTitle);

    if (cover && theme === "t8" && packageTitle.startsWith("T8 "))
      return `<a href="/">T8</a> <span class="name">${packageTitle.replace(/^T8 /, "")}</span>`;

    return withPackageURL
      ? `<a href="${root}" class="name">${escapedTitle}</a>`
      : `<span class="name">${escapedTitle}</span>`;
  }

  let scopeMatches = name?.match(/^(@[^/]+)\/?(.*)/);

  if (!scope || !scopeMatches) {
    let escapedName = escapeHTML(name);

    return withPackageURL
      ? `<a href="${root}" class="name">${escapedName}</a>`
      : `<span class="name">${escapedName}</span>`;
  }

  let title =
    `<a href="${scope}" class="scope">${scopeMatches[1]}</a>` +
    '<span class="sep">/</span>';

  title += withPackageURL
    ? `<a href="${root}" class="name">${scopeMatches[2]}</a>`
    : `<span class="name">${scopeMatches[2]}</span>`;

  return title;
}
