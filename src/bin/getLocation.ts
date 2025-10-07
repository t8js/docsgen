import type { Context } from "../types/Context";

export function getLocation(ctx: Context, path: string, preferredLocation?: string | undefined) {
  let { repo, mainBranch = "main" } = ctx;

  if (preferredLocation) return preferredLocation;

  let ghId = repo?.startsWith("https://github.com/")
    ? repo.replace("https://github.com/", "").split("/").slice(0, 2).join("/")
    : "";

  let urlPath = path.replace(/^\.?\//, "");

  if (ghId)
    return `https://raw.githubusercontent.com/${ghId}/refs/heads/${mainBranch}/${urlPath}`;

  return path;
}
