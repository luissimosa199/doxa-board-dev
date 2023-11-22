export function cropImageLink(url: string, stringToAdd: string): string {
  const parts = url.split("upload/");
  const modifiedUrl = parts[0] + "upload/" + stringToAdd + parts[1];
  return modifiedUrl;
}
