import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { Context } from "../types/Context";

export async function setCName({ dir = "", name, cname, jsorg }: Context) {
  let domain = "";

  if (cname) domain = cname;
  else if (typeof jsorg === "string") domain = jsorg ? `${jsorg}.js.org` : "";
  else if (jsorg === true) domain = name ? `${name}.js.org` : "";

  if (domain !== "") await writeFile(join(dir, "CNAME"), domain);
}
