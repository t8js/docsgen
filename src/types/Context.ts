import { BinConfig } from "./BinConfig";
import { EntryConfig } from "./EntryConfig";

export type Context = Omit<BinConfig, "entries"> & EntryConfig;
