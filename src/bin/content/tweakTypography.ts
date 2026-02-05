export function tweakTypography(s = "") {
  return s
    .replace(/\b(for|in|on|at|to|with|a|an|the|its)\s+/gi, "$1\xa0")
    .replace(/\b(React)\s+(apps?)\b/gi, "$1\xa0$2");
}
