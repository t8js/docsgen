import type { BinConfig } from "../types/BinConfig";
import type { PackageMetadata } from "../types/PackageMetadata";
import { toRepoURL } from "./toRepoURL";

export function toConfig(metadata: PackageMetadata): Partial<BinConfig> {
  let { name, description, version, repository } = metadata;

  return {
    name,
    description,
    version,
    repo: toRepoURL(repository),
  };
}
