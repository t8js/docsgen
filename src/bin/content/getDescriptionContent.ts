import type { Context } from "../../types/Context.ts";
import { escapeHTML } from "../../utils/escapeHTML.ts";
import { getParsedContent } from "../parsing/getParsedContent.ts";
import { tweakTypography } from "./tweakTypography.ts";

export async function getDescriptionContent(ctx: Context) {
  let escapedPackageDescription = escapeHTML(ctx.description);
  let { description } = await getParsedContent(ctx);

  return (
    tweakTypography(description) ||
    (escapedPackageDescription
      ? `<p>${tweakTypography(escapedPackageDescription)}<p>`
      : "")
  );
}
