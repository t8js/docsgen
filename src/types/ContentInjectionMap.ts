import type { ContentInjectionTarget } from "./ContentInjectionTarget";
import type { Page } from "./Page";

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
