import { Context } from "../types/Context";
import { setCName } from "./setCName";
import { setContent } from "./setContent";
import { setImages } from "./setImages";

export async function createFiles(ctx: Context) {
  await Promise.all([setCName(ctx), setContent(ctx), setImages(ctx)]);
}
