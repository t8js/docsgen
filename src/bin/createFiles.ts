import { setCName } from "./setCName";
import { setContent } from "./setContent";
import { setImages } from "./setImages";
import { setNpmIgnore } from "./setNpmIgnore";

export async function createFiles() {
  await Promise.all([setNpmIgnore(), setCName(), setContent(), setImages()]);
}
