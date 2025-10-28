import { JSDOM } from "jsdom";

export function stripHTML(content: string, replaceNbsp = false) {
  try {
    let s = new JSDOM(content).window.document.body.textContent;

    return replaceNbsp ? s.replaceAll("\xa0", " ") : s;
  } catch {}
}
