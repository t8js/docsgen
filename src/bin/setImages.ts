import { writeFile } from "node:fs/promises";
import { getIcon } from "../utils/getIcon";
import { getConfig } from "./getConfig";

export async function setImages() {
  let { colorScheme } = await getConfig();

  await writeFile("./favicon.svg", `${getIcon(colorScheme)}\n`);
}
