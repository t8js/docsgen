import { readFile, writeFile } from "node:fs/promises";

export async function setNpmIgnore() {
  let content = "";

  try {
    content = (await readFile("./.npmignore")).toString();
  } catch {}

  let listed = false;

  if (content) {
    let lines = content.split(/\r?\n/);

    for (let line of lines) {
      let k = line.search(/\b_includes\b/);

      if (k !== -1 && line.lastIndexOf("#", k) === -1) {
        listed = true;
        break;
      }
    }
  }

  if (!listed) {
    content = content.trimEnd();
    content += `${content ? "\n" : ""}_includes\n`;

    await writeFile("./.npmignore", content);
  }
}
