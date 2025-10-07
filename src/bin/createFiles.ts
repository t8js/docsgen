import { access, mkdir } from "node:fs/promises";
import type { Context } from "../types/Context";
import { setCName } from "./setCName";
import { setContent } from "./setContent";
import { setImages } from "./setImages";

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
