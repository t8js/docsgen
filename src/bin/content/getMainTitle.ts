import type { Context } from "../../types/Context.ts";
import { getParsedContent } from "../parsing/getParsedContent.ts";
import { getPlainTitle } from "./getPlainTitle.ts";

export async function getMainTitle(ctx: Context) {
  let { htmlTitle } = ctx;
  let { title: parsedTitle } = await getParsedContent(ctx);

  let plainTitle = await getPlainTitle(ctx);

  return htmlTitle || parsedTitle || plainTitle;
}
