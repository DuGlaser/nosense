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

export function shadeColor(color: string, percent: number) {
  const R = parseInt(color.substring(1, 3), 16);
  const G = parseInt(color.substring(3, 5), 16);
  const B = parseInt(color.substring(5, 7), 16);

  let numR = (R * (100 + percent)) / 100;
  let numG = (G * (100 + percent)) / 100;
  let numB = (B * (100 + percent)) / 100;

  numR = numR < 255 ? numR : 255;
  numG = numG < 255 ? numG : 255;
  numB = numB < 255 ? numB : 255;

  numR = Math.round(numR);
  numG = Math.round(numG);
  numB = Math.round(numB);

  const RR =
    numR.toString(16).length === 1
      ? '0' + numR.toString(16)
      : numR.toString(16);
  const GG =
    numG.toString(16).length === 1
      ? '0' + numG.toString(16)
      : numG.toString(16);
  const BB =
    numB.toString(16).length === 1
      ? '0' + numB.toString(16)
      : numB.toString(16);

  return '#' + RR + GG + BB;
}
