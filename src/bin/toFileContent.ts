export function toFileContent(x: string) {
  return `${x.replace(/\s+(\r?\n *<\/(script|link|head|body)>)/g, "$1").trim()}\n`;
}
