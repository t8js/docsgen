import { writeFile } from "node:fs/promises";
import { getIcon } from "../utils/getIcon";
import { Context } from "../types/Context";
import { join } from "node:path";

export async function setImages({ dir = "", colorScheme }: Context) {
  await writeFile(join(dir, "./favicon.svg"), `${getIcon(colorScheme)}\n`);
}
