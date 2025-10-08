import type { Config } from "./Config";
import type { EntryConfig } from "./EntryConfig";

export type Context = Omit<Config, "entries"> & EntryConfig;
