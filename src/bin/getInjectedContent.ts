import { ContentInjectionTarget } from "../types/ContentInjectionTarget";
import { Context } from "../types/Context";
import { Page } from "../types/Page";

export function getInjectedContent(
  ctx: Context,
  page: Page,
  target: ContentInjectionTarget,
  mode: "append" | undefined = "append",
) {
  let injectedContent = ctx[mode]?.[target];

  if (!injectedContent)
    return "";

  return (Array.isArray(injectedContent) ? injectedContent : [injectedContent])
    .reduce((s, item) => {
      if (item === undefined)
        return s;

      if (typeof item === "string")
        return `${s}${s ? "\n" : ""}${item}`;

      let { content, pages } = item;

      if (!content || (pages && !pages.includes(page)))
        return s;

      return `${s}${s ? "\n" : ""}${content}`;
    }, "");
}
