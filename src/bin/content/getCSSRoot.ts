import { exec as defaultExec } from "node:child_process";
import { cp } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { packageName } from "../../const/packageName.ts";
import type { Context } from "../../types/Context.ts";

const exec = promisify(defaultExec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let packageURL = "";
let packageVersionRequest: Promise<{ stdout: string }> | null = null;

let assetsCreated = new Map<string, boolean>();

export async function getCSSRoot(ctx: Context, type: "index" | "content") {
  let { dir = "", assetsDir } = ctx;

  let cssRoot = {
    index: "",
    content: "",
  };

  if (assetsDir) {
    cssRoot.index = assetsDir;
    cssRoot.content = `../${assetsDir}`;

    let assetsDestination = join(dir, cssRoot.index);

    if (!assetsCreated.get(assetsDestination)) {
      assetsCreated.set(assetsDestination, true);

      await cp(join(__dirname, "css"), assetsDestination, {
        force: true,
        recursive: true,
      });
    }
  } else {
    if (!packageURL) {
      packageVersionRequest ??= exec(`npm view ${packageName} version`);

      let packageVersion = (await packageVersionRequest).stdout
        .trim()
        .split(".")
        .slice(0, 2)
        .join(".");

      packageURL = `https://unpkg.com/${packageName}@${packageVersion}`;
    }

    cssRoot.index = `${packageURL}/dist/css`;
    cssRoot.content = `${packageURL}/dist/css`;
  }

  return cssRoot[type];
}
