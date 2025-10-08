export function toFileContent(x: string) {
  return `${x.replace(/\s+(<\/(head|body)>)/g, "\n$1").trim()}\n`;
}
