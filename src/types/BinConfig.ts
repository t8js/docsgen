import type { EntryConfig } from "./EntryConfig";

export type BinConfig = EntryConfig & {
  targetId?: string;
  entries?: EntryConfig[];
};
