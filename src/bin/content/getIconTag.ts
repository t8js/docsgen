import { Context } from "../../types/Context.ts";
import { getIcon } from "./getIcon.ts";

export function getIconTag(ctx: Context) {
  let { url, type } = getIcon(ctx);

  return url
    ? `<link rel="icon"${type ? ` type="${type}"` : ""} href="${url}">`
    : "";
}
