import type { EntryConfig } from "./EntryConfig";

export type Config = EntryConfig & {
  $schema?: string;
  targetId?: string;
  entries?: EntryConfig[];
};
