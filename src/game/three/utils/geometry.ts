export function getRingLetterPosition(index: number, total: number, radius: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle),
    angle,
  };
}

export function angleToIndex(angleRad: number, total: number): number {
  const normalized = ((angleRad + Math.PI / 2) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
  return Math.round((normalized / (Math.PI * 2)) * total) % total;
}

export function gridTo3D(
  row: number,
  col: number,
  cellSize: number,
): { x: number; z: number } {
  return {
    x: (col - 2) * cellSize,
    z: (row - 2) * cellSize,
  };
}
