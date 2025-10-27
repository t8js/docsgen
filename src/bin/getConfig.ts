import { parseArgs } from "args-json";
import type { Config } from "../types/Config";
import type { EntryConfig } from "../types/EntryConfig";
import type { PackageMetadata } from "../types/PackageMetadata";
import { fetchContent } from "./fetchContent";
import { getLocation } from "./getLocation";
import { stripHTML } from "./stripHTML";
import { toConfig } from "./toConfig";

async function addMetadata(config: EntryConfig) {
  try {
    let rawContent = await fetchContent(getLocation(config, "package.json"));
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

let config: Config | null = null;

export async function getConfig(): Promise<Config> {
  if (config) return config;

  let localConfig: Config = {};

  try {
    localConfig = JSON.parse(
      await fetchContent("./docsgen.config.json"),
    ) as Config;

    delete localConfig.$schema;
  } catch {}

  let args = process.argv.slice(2);
  let targetArgs: string[] = [];

  while (args[0] && !args[0].startsWith("--")) targetArgs.push(args.shift()!);

  config = {
    mainBranch: "main",
    root: "/",
    contentDir: "x",
    ...localConfig,
    ...parseArgs<Config>(args),
  };

  if (config.entries) {
    config.targetIds = targetArgs;
    config.entries = await Promise.all(config.entries.map(reviseConfig));
  } else {
    if (!config.dir)
      config.dir = targetArgs.find((arg) => !/^https?:\/\//.test(arg));

    if (!config.repo)
      config.repo = targetArgs.find((arg) => /^https?:\/\//.test(arg));

    config = await reviseConfig(config);
  }

  return config;
}
