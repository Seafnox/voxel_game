export function positionToPoint(cord: number, mapSize: number, surfaceSize: number): number {
  return cord * (mapSize/surfaceSize) + mapSize/2;
}
