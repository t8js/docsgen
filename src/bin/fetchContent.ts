import { readFile } from "node:fs/promises";

let cachedContent = new Map<string, string>();

export async function fetchContent(location: string | undefined) {
  if (!location) return "";

  let content = cachedContent.get(location);

  if (content !== undefined) return content;

  if (/^https?:\/\//.test(location)) {
    try {
      content = await (await fetch(location, { cache: "no-cache" })).text();
    } catch {
      console.warn(`Failed to fetch content from '${location}'`);
    }
  }
  else {
    let locationPath = location.replace(/^\//, "");

    content = (await readFile(locationPath)).toString();
  }

  cachedContent.set(location, content ??= "");

  return content;
}
