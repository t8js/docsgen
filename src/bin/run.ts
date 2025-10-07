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
  let { targetBranch, mainBranch, remove } = await getConfig();

  try {
    await access("./.git");
    isGitDir = true;
  } catch {}

  if (!isGitDir || !targetBranch) {
    await cleanup();
    await createFiles();
    return;
  }

  let originalBranch = await stdout("git rev-parse --abbrev-ref HEAD");

  if (originalBranch === targetBranch)
    await exec(`git checkout ${mainBranch}`);

  try {
    await exec(`git branch -D ${targetBranch}`);
  } catch {}
  try {
    await exec(`git push origin ${targetBranch} --delete`);
  } catch {}

  if (remove) return;

  await exec(`git checkout -b ${targetBranch}`);
  await createFiles();
  await exec("git add *");

  let updated = (await stdout("git diff --cached --name-only")) !== "";

  if (updated) {
    await exec('git commit -m "release gh-pages"');
    await exec(`git push -u origin ${targetBranch} -f`);
  }

  if (originalBranch && originalBranch !== targetBranch)
    await exec(`git checkout ${originalBranch}`);
}

(async () => {
  await run();
})();
