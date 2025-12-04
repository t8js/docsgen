import { parseArgs } from "args-json";
import type { Config } from "../types/Config.ts";
import type { EntryConfig } from "../types/EntryConfig.ts";
import type { PackageMetadata } from "../types/PackageMetadata.ts";
import { fetchContent } from "./fetchContent.ts";
import { getLocation } from "./getLocation.ts";
import { stripHTML } from "./stripHTML.ts";
import { toConfig } from "./toConfig.ts";

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

function deriveProps(config: EntryConfig) {
  let { dir, assetsDir, root, title, htmlTitle } = config;

  if (htmlTitle && !title) title = stripHTML(htmlTitle, true);
  if (dir && !root) root = `/${dir}/`;
  if (!root?.endsWith("/")) root = `${root ?? ""}/`;

  if (dir && assetsDir?.includes("{{dir}}"))
    assetsDir = assetsDir.replaceAll("{{dir}}", dir);

  return {
    ...config,
    dir,
    assetsDir,
    root,
    title,
    htmlTitle,
  };
}

async function reviseConfig(config: EntryConfig) {
  return deriveProps(await addMetadata(config));
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
