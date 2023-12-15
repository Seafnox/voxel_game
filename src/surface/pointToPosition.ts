export function pointToPosition(mapCord: number, mapSize: number, surfaceSize: number): number {
  return mapCord * (surfaceSize/mapSize) - surfaceSize/2;
}
