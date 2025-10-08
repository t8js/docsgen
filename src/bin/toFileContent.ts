export function toFileContent(x: string) {
  return `${x.replace(/\s+(\r?\n *<\/?(script|link|head|body|html|meta|title)[> ])/g, "$1").trim()}\n`;
}
