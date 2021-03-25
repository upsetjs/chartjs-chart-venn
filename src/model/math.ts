declare type Point = { cx: number; cy: number };

function len(x: number, y: number) {
  return Math.sqrt(x * x + y * y);
}
export function dist(a: Point, b: Point): number {
  return len(a.cx - b.cx, a.cy - b.cy);
}

export const DEG2RAD = (1 / 180) * Math.PI;

export function pointAtCircle(cx: number, cy: number, radius: number, angle: number): { x: number; y: number } {
  return {
    x: cx + Math.cos(angle * DEG2RAD) * radius,
    y: cy + Math.sin(angle * DEG2RAD) * radius,
  };
}
