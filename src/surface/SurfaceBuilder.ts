import { createNoise3D, NoiseFunction3D } from 'simplex-noise';
import { RandomFn } from 'simplex-noise/simplex-noise';

export type SurfaceMap = SurfacePoint[][];

export interface SurfacePoint {
  x: number;
  y: number;
  unit: number;
}

export class SurfaceBuilder {

  private simplexes: NoiseFunction3D[];

  constructor(
    private getRandom: RandomFn,
    mapSize: number,
  ) {
    this.simplexes = [
      this.newSimplex(this.getRandom, 1 * mapSize, 0.00625), // 2 * 10 / 10
      this.newSimplex(this.getRandom, 2 * mapSize, 0.0175), // 2 * 200 / 210
      this.newSimplex(this.getRandom, 4 * mapSize, 0.025), // 2 * 100 / 310
      this.newSimplex(this.getRandom, 8 * mapSize, 0.045), // 2 * 50 / 360
      this.newSimplex(this.getRandom, 16 * mapSize, 0.15), // 2 * 20 / 380
      this.newSimplex(this.getRandom, 32 * mapSize, 0.155), // 2 * 10 / 390
      this.newSimplex(this.getRandom, 64 * mapSize, 0.30), // 2 * 5 / 395
    ];
  }

  getSurfaceMap(mapWidth: number, mapHeight: number): SurfaceMap {
    const rgbMap: SurfaceMap = [];
    for (let x = 0; x < mapWidth; x++) {
      rgbMap[x] = [];
      for (let y = 0; y < mapHeight; y++) {
        const height = this.getUnit(this.xyToXyz(mapWidth, mapHeight, x, y)) + this.getRandom()*0.01;
        rgbMap[x][y] = {x, y, unit: height};
      }
    }
    return rgbMap;
  }

  private newSimplex(randomFn: RandomFn, zoom: number, scalar: number): NoiseFunction3D {
    const simplex = createNoise3D(randomFn);
    return (x, y, z) => (simplex(x * zoom, y * zoom, z * zoom) + 1) * scalar;
  }

  private getUnit({x, y, unit}: SurfacePoint) {
    return this.simplexes.map(s => s(x, y, unit)).reduce((a, b) => a + b, 0);
  }

  private xyToXyz(mapWidth: number, mapHeight: number, coordX: number, coordY: number): SurfacePoint {
    const w = (coordX + 0.5) / mapWidth;
    const h = (coordY + 0.5) / mapHeight;
    const x = Math.cos(h * Math.PI);
    const hr = w * 2 * Math.PI;
    const r = Math.sqrt(1 - h * h);
    const y = r * Math.cos(hr);
    const height = r * Math.sin(hr);
    return {x, y, unit: height};
  }
}
