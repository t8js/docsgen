import type { Config } from "./Config.ts";
import type { EntryConfig } from "./EntryConfig.ts";

export type Context = Omit<Config, "entries"> & EntryConfig;
