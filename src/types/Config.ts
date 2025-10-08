import type { EntryConfig } from "./EntryConfig";

export type Config = EntryConfig & {
  targetId?: string;
  entries?: EntryConfig[];
};
