import { Context } from "../types/Context.ts";
import { RepoMetadata } from "../types/RepoMetadata.ts";
import { fetchContent } from "./fetchContent.ts";

export async function getRepoMetadata({ repo }: Context): Promise<RepoMetadata> {
  if (repo?.startsWith("https://github.com/")) {
    try {
      let repoMetadata = await fetchContent(
        repo.replace("https://github.com/", "https://api.github.com/repos/"),
      );

      return JSON.parse(repoMetadata) as RepoMetadata;
    }
    catch {}
  }

  return {};
}
