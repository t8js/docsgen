export function getSVGDataURL(svg: string) {
  let base64SVG = "";

  if (typeof window !== "undefined") base64SVG = window.btoa(svg);
  else if (typeof Buffer !== "undefined")
    base64SVG = Buffer.from(svg).toString("base64");

  return `data:image/svg+xml;base64,${base64SVG}`;
}
