import { writeFile } from "node:fs/promises";
import { getConfig } from "./getConfig";

export async function setCName() {
  let { name, cname, jsorg } = await getConfig();
  let domain = "";

  if (cname) domain = cname;
  else if (typeof jsorg === "string") domain = jsorg ? `${jsorg}.js.org` : "";
  else if (jsorg === true) domain = name ? `${name}.js.org` : "";

  if (domain !== "") await writeFile("./CNAME", domain);
}
