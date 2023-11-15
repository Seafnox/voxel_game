import { Factor } from '../../engine/Factor';
import { SpatialHashGrid } from '../../grid/SpatialHashGrid';
import { VMath } from '../../VMath';
import { SurfaceMap, SurfacePoint, SurfaceBuilder } from './SurfaceBuilder';

export class SurfaceFactor implements Factor<SurfaceMap> {
  private _mapSize: number = 0;
  private _surfaceSize: number = 0;
  private _gridSize: number = 0;
  private _gridDimension: number = 0;
  private _surfaceScale: number = 0;
  private _surfaceMap: SurfaceMap = [];
  private _grid: SpatialHashGrid = this.createSpatialGrid();

  get value(): SurfaceMap {
    return this._surfaceMap;
  }
  get grid(): SpatialHashGrid {
    return this._grid;
  }

  get mapSize(): number {
    return this._mapSize;
  }

  get surfaceSize(): number {
    return this._surfaceSize;
  }

  get surfaceScale(): number {
    return this._surfaceScale;
  }

  get surfaceMap(): SurfaceMap {
    return this._surfaceMap;
  }
  generateSurface(
    mapSize: number,
    surfaceSize: number,
  ) {
    this._mapSize = mapSize;
    this._surfaceSize = surfaceSize;
    this._gridSize = this.surfaceSize / 4;
    this._gridDimension = this.surfaceSize / this.mapSize;
    this._surfaceScale = this.surfaceSize / this.mapSize;
    this._grid = this.createSpatialGrid();
    const surfaceBuilder = new SurfaceBuilder(0.003 * this._surfaceScale);
    this._surfaceMap = surfaceBuilder.getSurfaceMap(this.mapSize, this.mapSize);
  }

  getZCord(xCord: number, yCord: number): number {
    return this.getZCordByPoint(this.getSurfacePoint(xCord, yCord))
  }
  getMapIndex(cord: number): number {
    return Math.floor(cord * (this.mapSize/this.surfaceSize) + this.mapSize/2);
  }

  getSurfacePoint(xCord: number, yCord: number): SurfacePoint {
    const x = this.getMapIndex(xCord);
    const y = this.getMapIndex(yCord);
    return this._surfaceMap[x][y];
  }

  getZCordByPoint(point: SurfacePoint): number {
    return VMath.lerp(point.value, -150, 150);
  }

  private createSpatialGrid(): SpatialHashGrid {
    return new SpatialHashGrid(
      [[-this._gridSize, -this._gridSize], [this._gridSize, this._gridSize]],
      [this._gridDimension, this._gridDimension]
    );
  }
}
