import { access, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { Context } from "../../types/Context.ts";

export async function createDirs(ctx: Context) {
  let {
    dir = "",
    contentDir = "",
  } = ctx;

  let dirs = [contentDir];
  
  await Promise.all(
    dirs.map(async (path) => {
      let dirPath = join(dir, path);

      try {
        await access(dirPath);
      } catch {
        await mkdir(dirPath);
      }
    }),
  );
}
