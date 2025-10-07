import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { Context } from "../types/Context";
import { getIcon } from "../utils/getIcon";

export async function setImages({ dir = "", colorScheme }: Context) {
  await writeFile(join(dir, "./favicon.svg"), `${getIcon(colorScheme)}\n`);
}
