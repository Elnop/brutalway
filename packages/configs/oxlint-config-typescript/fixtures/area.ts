type Corner = { x: number };
interface Edge { length: number }
declare global {
  interface Window { shapeCount: number }
}
const double = (value: number) => value * 2;
export function area(edge: Edge, corner: Corner) {
  if (edge.length > 0)
    return double(edge.length) * corner.x;
  if (corner.x > 0) return corner.x;
  return 0;
}
export function perimeter(edge: Edge) {
  return edge.length * 4;
}
