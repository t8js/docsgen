export function getSectionPostprocess(
  linkMap: Record<string, string | undefined>,
) {
  return (content: string) => {
    let s = content;

    s = s.replace(/<a href="([^"]+)">/g, (_, url) => {
      let nextURL = linkMap[url] ?? url;
      let attrs = /^(https?:)?\/\//.test(nextURL) ? ' target="_blank"' : "";

      return `<a href="${nextURL}"${attrs}>`;
    });

    return s;
  };
}
