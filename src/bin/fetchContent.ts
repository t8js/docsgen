import { readFile } from "node:fs/promises";

export async function fetchContent(location: string | undefined) {
  if (!location) return "";

  if (/^https?:\/\//.test(location)) {
    try {
      return await (await fetch(location, { cache: "no-cache" })).text();
    } catch {
      console.warn(`Failed to fetch content from '${location}'`);
      return "";
    }
  }

  let locationPath = location.replace(/^\//, "");

  return (await readFile(locationPath)).toString();
}
