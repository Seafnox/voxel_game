import { Factor } from 'src/engine/Factor';
import { SpatialHashGrid } from 'src/entity/grid/SpatialHashGrid';
import { VMath } from 'src/VMath';
import { SurfaceMap, SurfacePoint, SurfaceBuilder } from './SurfaceBuilder';

export interface SurfaceLocation {
  leftTop: SurfacePoint;
  leftBottom: SurfacePoint;
  rightTop: SurfacePoint;
  rightBottom: SurfacePoint;
  position: {
    x: number;
    y: number;
  };
}

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
    return this.getZCordByLocation(this.getSurfaceLocation(xCord, yCord))
  }
  getCordToMap(cord: number): number {
    return cord * (this.mapSize/this.surfaceSize) + this.mapSize/2;
  }

  getSurfaceLocation(xCord: number, yCord: number): SurfaceLocation {
    const x = this.getCordToMap(xCord);
    const y = this.getCordToMap(yCord);
    const bottomX = Math.floor(x);
    const leftY = Math.floor(y);
    const topX = bottomX + 1;
    const rightY = leftY + 1;

    return {
      leftTop: this.getSurfacePoint(topX, leftY),
      leftBottom: this.getSurfacePoint(bottomX, leftY),
      rightTop: this.getSurfacePoint(topX, rightY),
      rightBottom: this.getSurfacePoint(bottomX, rightY),
      position: {x,y},
    }

  }

  getSurfacePoint(xMap: number, yMap: number): SurfacePoint {
    if (xMap > this.mapSize-1 || yMap > this.mapSize-1) {
      return this.getEmptyPoint(xMap, yMap);
    }

    if (xMap < 0 || yMap < 0) {
      return this.getEmptyPoint(xMap, yMap);
    }

    return this._surfaceMap[xMap][yMap];
  }

  getEmptyPoint(x: number, y: number): SurfacePoint {
    return {
      value: 0,
      color: [0,0,0],
      x,
      y,
    }
  }

  getZCordByLocation(area: SurfaceLocation): number {
    const bottomDiff = Math.abs(area.position.x - area.leftBottom.x);
    const topDiff = 1 - bottomDiff;
    const leftDiff = Math.abs(area.position.y - area.leftBottom.y);
    const rightDiff = 1 - leftDiff;
    const leftTopZ = this.getZCordByPoint(area.leftTop);
    const leftBottomZ = this.getZCordByPoint(area.leftBottom);
    const rightTopZ = this.getZCordByPoint(area.rightTop);
    const rightBottomZ = this.getZCordByPoint(area.rightBottom);

    if (bottomDiff + leftDiff < 1) {
      return [
        leftTopZ * bottomDiff,
        leftBottomZ * rightDiff,
        - leftBottomZ * bottomDiff,
        rightBottomZ * leftDiff,
      ].reduce((a, b) => a + b, 0);

    }

    return [
      leftTopZ * rightDiff,
      rightTopZ * leftDiff,
      - rightTopZ * topDiff,
      rightBottomZ * topDiff,
    ].reduce((a, b) => a + b, 0);
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
