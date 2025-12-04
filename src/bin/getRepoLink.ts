import type { Context } from "../types/Context.ts";

export function getRepoLink({ repo }: Context, className?: string) {
  if (!repo) return "";

  let caption = /\bgithub\.com\//.test(repo) ? "GitHub" : "Repository";

  return `<a href="${repo}"${className ? ` class="${className}"` : ""} target="_blank">${caption}</a>`;
}
