import type { Context } from "../types/Context.ts";

export function getNpmLink({ npm }: Context, className?: string) {
  if (!npm) return "";

  return `<a href="${npm}"${className ? ` class="${className}"` : ""} target="_blank">npm</a>`;
}
