import { readFile, writeFile } from "node:fs/promises";

/** @see https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/57467 */
async function fixJSDOMTypes() {
  let path = "node_modules/@types/jsdom/base.d.ts";
  let insertion = "        // @ts-ignore";
  let ignoredLines = [
    '        readonly ["Infinity"]: number;',
    '        readonly ["NaN"]: number;',
  ];

  try {
    let lines = (await readFile(path, { encoding: "utf-8" })).split(/\r?\n/);
    let updated = false;

    for (let s of ignoredLines) {
      let k = lines.indexOf(s);

      if (k !== -1 && lines[k - 1] !== insertion) {
        lines.splice(k, 0, insertion);
        updated = true;
      }
    }

    if (updated) await writeFile(path, lines.join("\n"));
  } catch {}
}

await fixJSDOMTypes();
