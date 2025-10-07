#!/usr/bin/env node
import { getConfig } from "./getConfig";
import { runEntry } from "./runEntry";

async function run() {
  let { targetId, entries, ...rootCtx } = await getConfig();

  if (!entries) {
    if (!targetId || targetId === rootCtx.id) return await runEntry(rootCtx);

    console.warn(`Specified config entry not found: '${targetId}'`);
    return;
  }

  if (targetId) {
    let entryCtx = entries.find(
      ({ id, dir }) => id === targetId || dir === targetId,
    );

    if (entryCtx) runEntry(entryCtx);
    else console.warn(`Specified config entry not found: '${targetId}'`);
  } else {
    await Promise.all(
      entries.map((entryCtx) => {
        return runEntry({ ...rootCtx, ...entryCtx });
      }),
    );
  }
}

(async () => {
  await run();
})();
