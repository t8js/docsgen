import { access, mkdir } from "node:fs/promises";
import type { Context } from "../types/Context.ts";
import { setCName } from "./setCName.ts";
import { setContent } from "./setContent.ts";
import { setImages } from "./setImages.ts";

export async function createFiles(ctx: Context) {
  let { dir } = ctx;

  if (dir) {
    try {
      await access(dir);
    } catch {
      await mkdir(dir);
    }
  }

  await Promise.all([setCName(ctx), setContent(ctx), setImages(ctx)]);
}
