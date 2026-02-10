import { rm } from "node:fs/promises";
import { join } from "node:path";
import type { Context } from "../types/Context.ts";

export async function cleanup({ dir = "", contentDir }: Context) {
  await Promise.all(
    [contentDir, "index.html"].map((path) => {
      return path && rm(join(dir, path), { force: true, recursive: true });
    }),
  );
}
