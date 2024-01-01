import { createNoise3D, NoiseFunction3D } from 'simplex-noise';
import { RandomFn } from 'simplex-noise/simplex-noise';

export type SurfaceMap = SurfacePoint[][];

export interface SurfacePoint {
  x: number;
  y: number;
  unit: number;
}

interface SpherePoint {
  x: number;
  y: number;
  z: number;
}

export class SurfaceBuilder {

  private simplexes: NoiseFunction3D[];

  constructor(
    private getRandom: RandomFn,
    mapScale: number,
  ) {
    this.simplexes = [
      this.newSimplex(this.getRandom, 1 * mapScale, 0.00625), // 2 * 10 / 10
      this.newSimplex(this.getRandom, 2 * mapScale, 0.0175), // 2 * 200 / 210
      this.newSimplex(this.getRandom, 4 * mapScale, 0.025), // 2 * 100 / 310
      this.newSimplex(this.getRandom, 8 * mapScale, 0.045), // 2 * 50 / 360
      this.newSimplex(this.getRandom, 16 * mapScale, 0.15), // 2 * 20 / 380
      this.newSimplex(this.getRandom, 32 * mapScale, 0.155), // 2 * 10 / 390
      this.newSimplex(this.getRandom, 64 * mapScale, 0.30), // 2 * 5 / 395
    ];
  }

  getSurfaceMap(mapWidth: number, mapHeight: number): SurfaceMap {
    const surfaceMap: SurfaceMap = [];
    for (let x = 0; x < mapWidth; x++) {
      surfaceMap[x] = [];
      for (let y = 0; y < mapHeight; y++) {
        const preUnit = this.getUnit(this.xyToXyz(mapWidth, mapHeight, x, y));
        const delta = this.getRandom()*0.01;
        const unit = preUnit + delta;
        surfaceMap[x][y] = {x, y, unit};
      }
    }
    return surfaceMap;
  }

  private newSimplex(randomFn: RandomFn, mapScale: number, scalar: number): NoiseFunction3D {
    const simplex = createNoise3D(randomFn);
    return (x, y, z) => {
      return (simplex(x * mapScale, y * mapScale, z * mapScale) + 1) * scalar;
    };
  }

  private getUnit({x, y, z}: SpherePoint) {
    return this.simplexes.map(s => s(x, y, z)).reduce((result, delta) => {
      return result + delta;
    }, 0);
  }

  private xyToXyz(mapWidth: number, mapHeight: number, cordX: number, cordY: number): SpherePoint {
    const w = (cordX + 0.5) / mapWidth;
    const h = (cordY + 0.5) / mapHeight;
    const x = Math.cos(h * Math.PI);
    const hr = w * 2 * Math.PI;
    const r = Math.sqrt(1 - h * h);
    const y = r * Math.cos(hr);
    const z = r * Math.sin(hr);
    return {x, y, z};
  }
}
