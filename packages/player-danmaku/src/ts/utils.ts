export function isDefaultColor(color: string) {
  color = color.toLowerCase();
  return color === '#fff' || color === '#ffffff';
}
