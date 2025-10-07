import { rm } from "node:fs/promises";

export async function cleanup() {
  await Promise.all(
    ["./x", "./index.html", "./start.html"].map((path) => {
      return rm(path, { force: true, recursive: true });
    }),
  );
}
