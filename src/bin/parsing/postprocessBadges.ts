import { JSDOM } from "jsdom";

export function postprocessBadges(content: string) {
  let { document } = new JSDOM(content).window;

  for (let img of document.querySelectorAll("img")) {
    let parent = img.parentElement;

    if (!parent) continue;

    let container = document.createElement("span");
    container.className = "badge";

    parent.insertBefore(container, img);
    container.append(img);
  }

  return document.body.innerHTML;
}
