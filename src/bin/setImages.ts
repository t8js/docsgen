import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { Context } from "../types/Context.ts";
import { getIconContent } from "../utils/getIconContent.ts";

export async function setImages({ dir = "", baseColor, favicon }: Context) {
  if (favicon) return;

  await writeFile(join(dir, "./favicon.svg"), `${getIconContent(baseColor)}\n`);
}
