import type { Config } from "../types/Config";
import type { PackageMetadata } from "../types/PackageMetadata";
import { toRepoURL } from "./toRepoURL";

export function toConfig(metadata: PackageMetadata): Partial<Config> {
  let { name, description, version, repository } = metadata;

  return {
    name,
    description,
    version,
    repo: toRepoURL(repository),
  };
}
