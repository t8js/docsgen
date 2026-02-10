import type { Context } from "../../types/Context.ts";
import { getParsedContent } from "../parsing/getParsedContent.ts";
import { getCounterContent } from "./getCounterContent.ts";
import { getCSSRoot } from "./getCSSRoot.ts";
import { getIconTag } from "./getIconTag.ts";
import { getInjectedContent } from "./getInjectedContent.ts";
import { getPlainTitle } from "./getPlainTitle.ts";
import { toFileContent } from "./toFileContent.ts";

export async function getStartContent(ctx: Context, delay?: number) {
  let { root, contentDir = "" } = ctx;
  let { nav } = await getParsedContent(ctx);
  let plainTitle = await getPlainTitle(ctx);

  let jsRedirect = `window.location.replace("${root}${contentDir}/${nav[0]?.id}");`;

  return toFileContent(`
<!DOCTYPE html>
<html lang="en" data-layout="start" class="blank">
<head>
  ${getInjectedContent(ctx, "start", "head", "prepend")}
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <meta http-equiv="refresh" content="${delay ?? 0}; URL=${root}${contentDir}/${nav[0]?.id}">
  <title>${plainTitle}</title>
  <link rel="stylesheet" href="${await getCSSRoot(ctx, "index")}/base.css">
  ${getIconTag(ctx)}
  <script>${delay === undefined ? jsRedirect : `setTimeout(() => { ${jsRedirect} }, ${delay * 1000});`}</script>
  ${getInjectedContent(ctx, "start", "head", "append")}
</head>
<body>
${getInjectedContent(ctx, "start", "body", "prepend")}
<div class="layout">
  <h1>${plainTitle}</h1>
</div>

${getCounterContent(ctx)}
${getInjectedContent(ctx, "start", "body", "append")}
</body>
</html>
  `);
}
