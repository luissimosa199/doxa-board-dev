import he from "he";

export function stripHtml(html: string): string {
  return he.decode(html.replace(/<[^>]*>?/gm, "")).replace("\n", " ");
}
