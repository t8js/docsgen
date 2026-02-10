import { JSDOM } from "jsdom";

function isPreviewURL(url: string) {
  return url.startsWith("https://codesandbox.io/p/sandbox/");
}

function getPreviewContent(url: string, title?: string) {
  let { pathname, searchParams } = new URL(url);
  let sandboxId = pathname.split("/").at(-1);
  let file = searchParams.get("file");

  let previewURL = new URL(`https://codesandbox.io/embed/${sandboxId}`);
  let previewContent = title ? `<legend>${title}</legend>` : "";

  previewURL.searchParams.set("view", "preview");

  if (file) previewURL.searchParams.set("module", file);

  previewContent +=
    `<iframe src="${previewURL.href}"${title ? ` title="${title}"` : ""} sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts" loading="lazy"></iframe>`;

  return previewContent;
}

export function getSectionPostprocess(
  linkMap: Record<string, string | undefined>,
) {
  return (content: string) => {
    let { document } = new JSDOM(content).window;

    for (let a of document.querySelectorAll("a")) {
      let href = a.getAttribute("href");

      if (href === null) continue;

      if (isPreviewURL(href) && a.parentElement) {
        let preview = document.createElement("fieldset");

        preview.innerHTML = getPreviewContent(href, a.innerHTML);

        a.parentElement.insertBefore(preview, a);
        a.remove();
      }
      else {
        let nextHref = linkMap[href] ?? href;

        a.setAttribute("href", nextHref);
        if (/^(https?:)?\/\//.test(nextHref)) a.setAttribute("target", "_blank");
      }
    }

    return document.body.innerHTML;
  };
}
