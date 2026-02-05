export function toFileContent(x: string) {
  let s = x
    .replace(
      /\s+(\r?\n *<\/?(script|link|head|body|html|meta|title)[> ])/g,
      "$1",
    )
    .replace(
      /\s+(\r?\n *<\/?(main|header|footer|nav|section|div|h\d|p|ul|ol|li|table)[> ])/g,
      "$1",
    )
    .trim();

  return `${s}\n`;
}
