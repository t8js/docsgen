import { readFile } from "node:fs/promises";

export async function fetchText(location: string | undefined) {
  if (!location) return "";

  if (/^https?:\/\//.test(location)) {
    try {
      return await (await fetch(location)).text();
    } catch {
      console.warn(`Failed to fetch content from '${location}'`);
      return "";
    }
  }

  return (await readFile(location)).toString();
}
