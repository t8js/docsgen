import { rm } from "node:fs/promises";
import { join } from "node:path";
import { Context } from "../types/Context";

export async function cleanup({ dir = "" }: Context) {
  await Promise.all(
    ["x", "index.html", "start.html"].map((path) => {
      return rm(join(dir, path), { force: true, recursive: true });
    }),
  );
}
