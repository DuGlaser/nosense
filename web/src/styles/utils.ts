export function hexToRgba(hexColor: string, alpha: number): string {
  let color = hexColor.slice(1);
  if (color.length === 3) {
    color = color + color;
  }

  const r = parseInt(color.slice(0, 2), 16);
  const g = parseInt(color.slice(2, 4), 16);
  const b = parseInt(color.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
