export function isHexColor(color: string) {
  const hexColorRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  return hexColorRegex.test(color);
}

export function isRealNumber(value: string) {
  const realNumberRegex = /^-?\d+(\.\d+)?$/;
  return realNumberRegex.test(value);
}
