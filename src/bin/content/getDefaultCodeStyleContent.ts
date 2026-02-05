export function getDefaultCodeStyleContent(cssRoot: string) {
  return `
<link rel="stylesheet" href="https://unpkg.com/@highlightjs/cdn-assets@11.11.1/styles/stackoverflow-light.min.css" media="(prefers-color-scheme: light)">
<link rel="stylesheet" href="https://unpkg.com/@highlightjs/cdn-assets@11.11.1/styles/base16/material.min.css" media="(prefers-color-scheme: dark)">
<link rel="stylesheet" href="${cssRoot}/code.css">
<script src="https://unpkg.com/@highlightjs/cdn-assets@11.11.1/highlight.min.js"></script>
<script>hljs.highlightAll()</script>
  `.trim();
}
