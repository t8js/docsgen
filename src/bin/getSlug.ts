export function getSlug(title: string | null) {
  if (!title) return "";

  let slug = title.trim();

  if (
    (slug.startsWith("<") && slug.endsWith(">")) ||
    (slug.startsWith("`") && slug.endsWith("`"))
  )
    slug = slug.slice(1, -1);

  slug = slug
    .replace(/[<>`:?!.,]+/g, " ")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/'/g, "");

  if (/^\w+\(\)$/.test(slug)) slug = slug.slice(0, -2);

  return slug;
}
