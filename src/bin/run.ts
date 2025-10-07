#!/usr/bin/env node
import { exec as defaultExec } from "node:child_process";
import { access } from "node:fs/promises";
import { promisify } from "node:util";
import { cleanup } from "./cleanup";
import { createFiles } from "./createFiles";
import { getConfig } from "./getConfig";

const exec = promisify(defaultExec);
const stdout = async (cmd: string) => (await exec(cmd)).stdout.trim();

async function run() {
  let isGitDir = false;

  try {
    await access("./.git");
    isGitDir = true;
  } catch {}

  if (!isGitDir) {
    await cleanup();
    await createFiles();
    return;
  }

  let { ghPagesBranch, mainBranch, remove } = await getConfig();

  let originalBranch = await stdout("git rev-parse --abbrev-ref HEAD");

  if (originalBranch === ghPagesBranch)
    await exec(`git checkout ${mainBranch}`);

  try {
    await exec(`git branch -D ${ghPagesBranch}`);
  } catch {}
  try {
    await exec(`git push origin ${ghPagesBranch} --delete`);
  } catch {}

  if (remove) return;

  await exec(`git checkout -b ${ghPagesBranch}`);
  await createFiles();
  await exec("git add *");

  let updated = (await stdout("git diff --cached --name-only")) !== "";

  if (updated) {
    await exec('git commit -m "release gh-pages"');
    await exec(`git push -u origin ${ghPagesBranch} -f`);
  }

  if (originalBranch && originalBranch !== ghPagesBranch)
    await exec(`git checkout ${originalBranch}`);
}

(async () => {
  await run();
})();
