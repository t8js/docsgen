export function getInstallationCode(element: Element) {
  return element
    .querySelector("code")
    ?.innerHTML.trim()
    .match(/(\S\s*)?(npm (i|install) .*)/)?.[2];
}
