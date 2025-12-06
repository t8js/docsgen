import type { ContentInjectionTarget } from "../types/ContentInjectionTarget.ts";
import type { Context } from "../types/Context.ts";
import type { Page } from "../types/Page.ts";

export function getInjectedContent(
  ctx: Context,
  page: Page,
  target: ContentInjectionTarget,
  mode: "append" | "prepend",
) {
  let injectedContent = ctx[mode]?.[target];

  if (!injectedContent) return "";

  return (
    Array.isArray(injectedContent) ? injectedContent : [injectedContent]
  ).reduce<string>((s, item) => {
    if (item === undefined) return s;

    if (typeof item === "string") return `${s}${s ? "\n" : ""}${item}`;

    let { content, pages } = item;

    if (!content || (pages && !pages.includes(page))) return s;

    return `${s}${s ? "\n" : ""}${content}`;
  }, "");
}
