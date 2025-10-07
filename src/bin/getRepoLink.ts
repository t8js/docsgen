import { getConfig } from "./getConfig";

export async function getRepoLink(className?: string) {
  let { repo } = await getConfig();

  if (!repo) return "";

  let caption = /\bgithub\.com\//.test(repo) ? "GitHub" : "Repository";

  return `<a href="${repo}"${className ? ` class="${className}"` : ""} target="_blank">${caption}</a>`;
}
