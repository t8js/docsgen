import type { ContentInjectionTarget } from "./ContentInjectionTarget.ts";
import type { Page } from "./Page.ts";

type InjectedContent =
  | string
  | undefined
  | {
      content?: string | undefined;
      pages?: Page[];
    };

export type ContentInjectionMap<T extends ContentInjectionTarget> = Partial<
  Record<T, InjectedContent | InjectedContent[]>
>;
