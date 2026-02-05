import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { Context } from "../types/Context.ts";
import { getParsedContent } from "./parsing/getParsedContent.ts";
import { getRedirectContent } from "./content/getRedirectContent.ts";
import { getStartContent } from "./content/getStartContent.ts";
import { getIndexContent } from "./content/getIndexContent.ts";
import { getSectionContent } from "./content/getSectionContent.ts";
import { createDirs } from "./content/createDirs.ts";

export async function setContent(ctx: Context) {
  let { dir = "", contentDir = "", redirect } = ctx;

  if (redirect) {
    await writeFile(join(dir, "index.html"), getRedirectContent(ctx));
    return;
  }

  let { sections, nav } = await getParsedContent(ctx);

  await createDirs(ctx);

  await Promise.all([
    ...sections.map(async (_, i) =>
      writeFile(
        join(dir, contentDir, `${nav[i]?.id ?? `_Section_${i + 1}`}.html`),
        await getSectionContent(ctx, i),
      ),
    ),
    writeFile(join(dir, "index.html"), await getIndexContent(ctx)),
    writeFile(join(dir, "start.html"), await getStartContent(ctx)),
  ]);
}
