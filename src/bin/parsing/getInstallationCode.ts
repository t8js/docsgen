export function getInstallationCode(element: Element) {
  return element
    .querySelector("code")
    ?.textContent.trim()
    .match(/(\S\s*)?(npm (i|install) .*)/)?.[2];
}
