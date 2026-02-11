import { JSDOM } from "jsdom";

function isPreviewURL(url: string) {
  return url.startsWith("https://codesandbox.io/p/sandbox/");
}

function getPreviewContent(url: string, title?: string) {
  let { pathname, searchParams } = new URL(url);
  let sandboxId = pathname.split("/").at(-1);

  let file = searchParams.get("file");
  let height = searchParams.get("h");

  let previewURL = new URL(`https://codesandbox.io/embed/${sandboxId}`);
  let content = title ? `<legend>${title}</legend>` : "";

  previewURL.searchParams.set("view", "preview");
  previewURL.searchParams.set("hidedevtools", "1");
  previewURL.searchParams.set("theme", "dark");

  if (file) previewURL.searchParams.set("module", file);

  let attrs = ['class="csb"', `src="${previewURL.href}"`];

  if (title) attrs.push(`title="${title}"`);
  if (height) attrs.push(`style="height: ${height}px;"`);

  content += `<iframe ${attrs.join(" ")} sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts" loading="lazy"></iframe>`;

  return content;
}

function isEmpty(element: Element) {
  return element.innerHTML.trim() === "";
}

function insertPreview(preview: HTMLElement, a: HTMLAnchorElement) {
  let p: HTMLElement | null = a.closest("p");

  if (p?.parentElement) {
    p.parentElement.insertBefore(preview, p);

    if (a.nextElementSibling?.matches("br")) a.nextElementSibling.remove();

    a.remove();

    if (isEmpty(p)) p.remove();

    return;
  }

  let li = a.closest("li");
  let list = li?.closest("ul, ol");

  if (li && list?.parentElement) {
    list.parentElement.insertBefore(preview, list);

    a.remove();

    if (isEmpty(li)) li.remove();
    if (isEmpty(list)) list.remove();
  }
}

export function getSectionPostprocess(
  linkMap: Record<string, string | undefined>,
) {
  return (content: string) => {
    let { document } = new JSDOM(content).window;

    for (let a of document.querySelectorAll("a")) {
      let href = a.getAttribute("href");

      if (href === null) continue;

      if (isPreviewURL(href)) {
        let preview = document.createElement("fieldset");

        preview.innerHTML = getPreviewContent(href, a.innerHTML);

        insertPreview(preview, a);
      } else {
        let nextHref = linkMap[href] ?? href;

        a.setAttribute("href", nextHref);

        if (/^(https?:)?\/\//.test(nextHref))
          a.setAttribute("target", "_blank");
      }
    }

    return document.body.innerHTML;
  };
}
