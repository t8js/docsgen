import type { BinConfig } from "./BinConfig";
import type { EntryConfig } from "./EntryConfig";

export type Context = Omit<BinConfig, "entries"> & EntryConfig;
