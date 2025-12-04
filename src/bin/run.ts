#!/usr/bin/env node
import { getConfig } from "./getConfig.ts";
import { runEntry } from "./runEntry.ts";

async function run() {
  let { targetIds, entries, ...rootCtx } = await getConfig();

  if (!entries) return await runEntry(rootCtx);

  let targetEntries =
    targetIds && targetIds.length !== 0
      ? entries.filter(({ id, dir }) => {
          return (
            (id && targetIds.includes(id)) || (dir && targetIds.includes(dir))
          );
        })
      : entries;

  await Promise.all(
    targetEntries.map((entryCtx) => runEntry({ ...rootCtx, ...entryCtx })),
  );
}

(async () => {
  await run();
})();
