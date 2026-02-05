import type { Context } from "../../types/Context.ts";
import { escapeHTML } from "../../utils/escapeHTML.ts";
import { getCounterContent } from "./getCounterContent.ts";
import { getInjectedContent } from "./getInjectedContent.ts";
import { toFileContent } from "./toFileContent.ts";
import { getIconTag } from "./getIconTag.ts";

export function getRedirectContent(ctx: Context) {
  let { redirect } = ctx;
  let escapedRedirect = escapeHTML(redirect);

  return toFileContent(`
<!DOCTYPE html>
<html lang="en" data-layout="redirect" class="blank">
<head>
  ${getInjectedContent(ctx, "redirect", "head", "prepend")}
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <meta http-equiv="refresh" content="0; URL=${escapedRedirect}">
  ${getIconTag(ctx)}
  ${getInjectedContent(ctx, "redirect", "head", "append")}
</head>
<body>
${getInjectedContent(ctx, "redirect", "body", "prepend")}
${getCounterContent(ctx)}
${getInjectedContent(ctx, "redirect", "body", "append")}
<script>window.location.replace("${escapedRedirect}");</script>
</body>
</html>
  `);
}
