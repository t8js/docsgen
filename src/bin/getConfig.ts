import { parseArgs } from "args-json";
import type { BinConfig } from "../types/BinConfig";
import type { EntryConfig } from "../types/EntryConfig";
import type { PackageMetadata } from "../types/PackageMetadata";
import { fetchText } from "./fetchText";
import { getLocation } from "./getLocation";
import { toConfig } from "./toConfig";
import { stripHTML } from "./stripHTML";

async function addMetadata(config: EntryConfig) {
  try {
    let rawContent = await fetchText(getLocation(config, "package.json"));
    let metadata = JSON.parse(rawContent) as PackageMetadata;

    return {
      ...toConfig(metadata),
      ...config,
    };
  } catch {
    return config;
  }
}

function deriveMissingProps(config: EntryConfig) {
  let { dir, root, title, htmlTitle } = config;

  if (htmlTitle && !title) title = stripHTML(htmlTitle);
  if (dir && !root) root = `/${dir}/`;
  if (!root?.endsWith("/")) root = `${root ?? ""}/`;

  return {
    ...config,
    dir,
    root,
    title,
    htmlTitle,
  };
}

async function reviseConfig(config: EntryConfig) {
  return deriveMissingProps(await addMetadata(config));
}

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

  if (config.entries)
    config.entries = await Promise.all(config.entries.map(reviseConfig));
  else config = await reviseConfig(config);

  return config;
}
