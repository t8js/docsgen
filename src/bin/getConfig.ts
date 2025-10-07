import { parseArgs } from "args-json";
import type { BinConfig } from "../types/BinConfig";
import type { PackageMetadata } from "../types/PackageMetadata";
import { fetchText } from "./fetchText";
import { toConfig } from "./toConfig";
import { getLocation } from "./getLocation";

let config: BinConfig | null = null;

export async function getConfig(): Promise<BinConfig> {
  if (config) return config;

  let localConfig: BinConfig = {};

  try {
    localConfig = JSON.parse(
      await fetchText("./docsgen.config.json"),
    ) as BinConfig;
  } catch {}

  let targetId: string | undefined;
  let args = process.argv.slice(2);

  if (args.length !== 0 && !args[0].startsWith("--")) targetId = args.shift();

  config = {
    targetId,
    mainBranch: "main",
    root: "/",
    contentDir: "x",
    ...localConfig,
    ...parseArgs<BinConfig>(args),
  };

  try {
    let rawContent = await fetchText(getLocation(config, "package.json"));
    let metadata = JSON.parse(rawContent) as PackageMetadata;

    config = {
      ...toConfig(metadata),
      ...config,
    };
  } catch {}

  if (!config.root?.endsWith("/")) config.root = `${config.root ?? ""}/`;

  return config;
}
