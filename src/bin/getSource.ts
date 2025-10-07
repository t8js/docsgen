import type { Context } from "../types/Context";

export function getSource(ctx: Context) {
  let { source, repo, mainBranch = "main" } = ctx;

  if (source) return source;

  let ghId = repo?.startsWith("https://github.com/")
    ? repo.replace("https://github.com/", "").split("/").slice(0, 2).join("/")
    : "";

  if (ghId)
    return `https://raw.githubusercontent.com/${ghId}/refs/heads/${mainBranch}/README.md`;

  return "README.md";
}
