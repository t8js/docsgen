import { JSDOM } from "jsdom";

export function stripHTML(content: string) {
  try {
    return new JSDOM(content).window.document.body.textContent;
  }
  catch {}
}
