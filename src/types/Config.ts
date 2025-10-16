import type { EntryConfig } from "./EntryConfig";

export type Config = EntryConfig & {
  $schema?: string;
  targetIds?: string[];
  entries?: EntryConfig[];
};
