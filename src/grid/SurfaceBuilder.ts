import { createNoise3D, NoiseFunction3D } from 'simplex-noise';
import { RGBPoint } from './RGBPoint';
import { surfaceEntries, SurfaceEntry } from './TempSurfaceConstant';

export interface SurfacePoint {
  color: RGBPoint;
  value: number;
}

type Surface3dPosition = [number, number, number];

export class SurfaceBuilder {

  private simplexes: NoiseFunction3D[];

  constructor(
    mapSize: number,
  ) {
    this.simplexes = [
      this.newSimplex(1 * mapSize, 0.5), // 2 * 10 / 10
      this.newSimplex(2 * mapSize, 0.525), // 2 * 200 / 210
      this.newSimplex(4 * mapSize, 1.55), // 2 * 100 / 310
      this.newSimplex(8 * mapSize, 3.6), // 2 * 50 / 360
      this.newSimplex(16 * mapSize, 9.5), // 2 * 20 / 380
      this.newSimplex(32 * mapSize, 19.5), // 2 * 10 / 390
      this.newSimplex(64 * mapSize, 39.5), // 2 * 5 / 395
    ];
  }

  getMap(mapWidth: number, mapHeight: number): SurfacePoint[][] {
    const rgbMap: SurfacePoint[][] = [];
    for (let x = 0; x < mapWidth; x++) {
      rgbMap[x] = [];
      for (let y = 0; y < mapHeight; y++) {
        const value = this.getValue(...this.xyToXyz(mapWidth, mapHeight, x, y));
        rgbMap[x][y] = {
          color: this.valueToColor(value),
          value,
        };
      }
    }
    return rgbMap;
  }

  private newSimplex(zoom: number, scalar: number): NoiseFunction3D {
    const simplex = createNoise3D();
    return (x, y, z) => (simplex(x * zoom, y * zoom, z * zoom) + 1) * scalar / 120;
  }

  private getValue(...[x, y, z]: Surface3dPosition) {
    return this.simplexes.map(s => s(x, y, z)).reduce((a, b) => a + b, 0);
  }

  private valueToColor(value: number): RGBPoint {
    // return [value * 255, value * 255, value * 255]
    const surfaceEntry: SurfaceEntry | undefined = surfaceEntries.find(surfaceKV => surfaceKV[0] > value);
    return surfaceEntry?.[1] || [0, 0, 0]; // бездна;
  }

  private xyToXyz(mapWidth: number, mapHeight: number, coordX: number, coordY: number): Surface3dPosition {
    const w = (coordX + 0.5) / mapWidth;
    const h = (coordY + 0.5) / mapHeight;
    const x = Math.cos(h * Math.PI);
    const hr = w * 2 * Math.PI;
    const r = Math.sqrt(1 - h * h);
    const y = r * Math.cos(hr);
    const z = r * Math.sin(hr);
    return [x, y, z];
  }
}
