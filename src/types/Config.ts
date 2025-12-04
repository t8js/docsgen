import type { EntryConfig } from "./EntryConfig.ts";

export type Config = EntryConfig & {
  $schema?: string;
  targetIds?: string[];
  entries?: EntryConfig[];
};
