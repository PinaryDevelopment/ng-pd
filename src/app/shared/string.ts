export function isNullOrWhiteSpace(str: string) {
  return !str || /^\s*$/.test(str);
}
