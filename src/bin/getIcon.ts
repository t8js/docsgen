import type { Context } from "../types/Context.ts";

const iconTypeMap: Record<string, string> = {
  ico: "image/x-icon",
  svg: "image/svg+xml",
  png: "image/png",
  gif: "image/gif",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
};

type Icon = {
  url?: string | undefined;
  type?: string | undefined;
};

export function getIcon({ favicon, faviconType }: Context) {
  let icon: Icon = {
    url: favicon,
    type: faviconType,
  };

  if (icon.url && !icon.type) {
    let ext = icon.url.split("/").at(-1)?.split(".").at(-1)?.toLowerCase();

    if (ext) icon.type = iconTypeMap[ext];
  }

  return icon;
}
