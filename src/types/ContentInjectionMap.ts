import type { ContentInjectionTarget } from "./ContentInjectionTarget.ts";
import type { Page } from "./Page.ts";

type InjectedContent =
  | string
  | undefined
  | {
      content?: string | undefined;
      pages?: Page[];
    };

export type ContentInjectionMap = Partial<
  Record<ContentInjectionTarget, InjectedContent | InjectedContent[]>
>;
