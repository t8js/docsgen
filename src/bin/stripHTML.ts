import { JSDOM } from "jsdom";

export function stripHTML(content: string, replaceNbsp = false) {
  if (!content) return "";

  try {
    let t = content.replaceAll("<sup>", " (").replaceAll("</sup>", ")");
    let s = new JSDOM(t).window.document.body.textContent;

    if (replaceNbsp) s = s.replaceAll("\xa0", " ");
    s = s.replace(/ +/g, " ");

    return s;
  } catch {}
}
