import type { PackageMetadata } from "../types/PackageMetadata";

export function toRepoURL(x: PackageMetadata["repository"]) {
  if (!x) return "";

  let s = typeof x === "string" ? x : x.url;

  if (!s) return;

  if (/^https?:\/\//.test(s)) return s;

  if (/^git\+https?:\/\/.*\.git$/.test(s))
    return s.replace(/^git\+(https?:\/\/.*)\.git$/, "$1");

  if (/^git:\/\/.*\.git$/.test(s))
    return s.replace(/^git(:\/\/.*)\.git$/, "https$1");

  if (/^github:/.test(s))
    return `https://github.com/${s.replace(/^github:/, "")}`;

  return "";
}
