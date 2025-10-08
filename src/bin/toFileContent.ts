export function toFileContent(x: string) {
  return `${x.replace(/\s+(\r?\n *<\/?(script|link|head|body|html)>)/g, "$1").trim()}\n`;
}
