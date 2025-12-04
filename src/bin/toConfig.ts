import type { Config } from "../types/Config.ts";
import type { PackageMetadata } from "../types/PackageMetadata.ts";
import { toRepoURL } from "./toRepoURL.ts";

export function toConfig(metadata: PackageMetadata): Partial<Config> {
  let { name, description, version, repository } = metadata;

  return {
    name,
    description,
    version,
    repo: toRepoURL(repository),
  };
}
