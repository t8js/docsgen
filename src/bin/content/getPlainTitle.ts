import { Context } from "../../types/Context.ts";
import { escapeHTML } from "../../utils/escapeHTML.ts";
import { getParsedContent } from "../parsing/getParsedContent.ts";
import { stripHTML } from "../stripHTML.ts";

export async function getPlainTitle(ctx: Context) {
  let {
    name,
    title,
    htmlTitle,
  } = ctx;

  let { title: parsedTitle } = await getParsedContent(ctx);

  return escapeHTML(
    title || stripHTML(htmlTitle || parsedTitle, true) || name,
  );
}
