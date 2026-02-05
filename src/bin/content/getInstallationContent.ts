import { Context } from "../../types/Context.ts";
import { escapeHTML } from "../../utils/escapeHTML.ts";
import { getParsedContent } from "../parsing/getParsedContent.ts";

export async function getInstallationContent(ctx: Context) {
  let { name, isDevDep } = ctx;
  let { installation} = await getParsedContent(ctx);

  if (!installation || isDevDep !== undefined)
    installation = `npm i${isDevDep ? " -D" : ""} ${name}`;

  return `<code>${escapeHTML(installation)}</code>`;
}
