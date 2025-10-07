import { parseArgs } from "args-json";
import type { BinConfig } from "../types/BinConfig";
import type { PackageMetadata } from "../types/PackageMetadata";
import { fetchText } from "./fetchText";
import { toConfig } from "./toConfig";

let config: BinConfig | null = null;

export async function getConfig(): Promise<BinConfig> {
  if (config) return config;

  let metadata: PackageMetadata = {};

  try {
    metadata = JSON.parse(await fetchText("./package.json")) as PackageMetadata;
  } catch {}

  let localConfig: BinConfig = {};

  try {
    localConfig = JSON.parse(
      await fetchText("./docsgen.config.json"),
    ) as BinConfig;
  } catch {}

  let targetId: string | undefined;
  let args = process.argv.slice(2);

  if (!args[0].startsWith("--")) targetId = args.shift();

  config = {
    targetId,
    mainBranch: "main",
    root: "/",
    contentDir: "x",
    ...toConfig(metadata),
    ...localConfig,
    ...parseArgs<BinConfig>(args),
  };

  if (!config.root?.endsWith("/")) config.root = `${config.root ?? ""}/`;

  return config;
}
