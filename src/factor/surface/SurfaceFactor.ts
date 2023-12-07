import { RandomFn } from 'simplex-noise/simplex-noise';
import { Factor } from '../../engine/Factor';
import { RGBColor } from './RGBColor';
import { SurfaceEntry, surfaceEntries } from './TempSurfaceConstant';
import { VMath } from '../../VMath';
import { SurfaceMap, SurfaceBuilder, SurfacePoint } from './SurfaceBuilder';

export interface SurfaceMapLocation {
  leftTop: SurfacePoint;
  leftBottom: SurfacePoint;
  rightTop: SurfacePoint;
  rightBottom: SurfacePoint;
  position: {
    x: number;
    y: number;
  };
}

export class SurfaceFactor implements Factor {
  private _mapSize: number = 0;
  private _surfaceSize: number = 0;
  private _surfaceScale: number = 0;
  private _surfaceMap: SurfaceMap = [];

  get surfaceMap(): SurfaceMap {
    return this._surfaceMap;
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

  generateSurface(
    randomFn: RandomFn,
    mapSize: number,
    surfaceSize: number,
  ) {
    this._mapSize = mapSize;
    this._surfaceSize = surfaceSize;
    this._surfaceScale = this.surfaceSize / this.mapSize;
    const surfaceBuilder = new SurfaceBuilder(randomFn, 0.003 * this._surfaceScale);
    this._surfaceMap = surfaceBuilder.getSurfaceMap(this.mapSize, this.mapSize);
  }

  getZCord(xCord: number, yCord: number): number {
    return this.getZCordByLocation(this.getSurfaceLocation(xCord, yCord))
  }

  getSurfaceMapHeight(x: number, y: number): number {
    return this.getHeightByLocation(this.getSurfaceMapLocation(x, y));
  }

  getSurfaceMapColor(x: number, y: number): RGBColor {
    return this.heightToColor(this.getSurfaceMapHeight(x, y));
  }

  getCordToMap(cord: number): number {
    return cord * (this.mapSize/this.surfaceSize) + this.mapSize/2;
  }

  getMapToCord(mapCord: number): number {
    return mapCord * (this.surfaceSize/this.mapSize) - this.surfaceSize/2;
  }

  getSurfaceLocation(xCord: number, yCord: number): SurfaceMapLocation {
    const x = this.getCordToMap(xCord);
    const y = this.getCordToMap(yCord);

    return this.getSurfaceMapLocation(x,y);
  }

  getSurfaceMapLocation(x: number, y: number): SurfaceMapLocation {
    const bottomX = Math.floor(x);
    const leftY = Math.floor(y);
    const topX = bottomX === x ? x : bottomX + 1;
    const rightY = leftY === y ? y : leftY + 1;

    return {
      leftTop: this.getSurfacePosition(topX, leftY),
      leftBottom: this.getSurfacePosition(bottomX, leftY),
      rightTop: this.getSurfacePosition(topX, rightY),
      rightBottom: this.getSurfacePosition(bottomX, rightY),
      position: {x,y},
    }
  }

  private heightToColor(height: number): RGBColor {
    const surfaceEntry: SurfaceEntry | undefined = surfaceEntries.find(surfaceKV => surfaceKV[0] > height);
    return surfaceEntry?.[1] || [0, 0, 0]; // бездна;
  }

  private getHeightByLocation(area: SurfaceMapLocation): number {
    const {x: leftX, y: bottomY} = area.leftBottom;
    const bottomDiff = Math.abs(area.position.x - leftX);
    const topDiff = 1 - bottomDiff;
    const leftDiff = Math.abs(area.position.y - bottomY);
    const rightDiff = 1 - leftDiff;
    const leftTopHeight = area.leftTop.height;
    const leftBottomHeight = area.leftBottom.height;
    const rightTopHeight = area.rightTop.height;
    const rightBottomHeight = area.rightBottom.height;

    if (bottomDiff + leftDiff < 1) {
      return [
        leftTopHeight * bottomDiff,
        leftBottomHeight * rightDiff,
        - leftBottomHeight * bottomDiff,
        rightBottomHeight * leftDiff,
      ].reduce((a, b) => a + b, 0);

    }

    return [
      leftTopHeight * rightDiff,
      rightTopHeight * leftDiff,
      - rightTopHeight * topDiff,
      rightBottomHeight * topDiff,
    ].reduce((a, b) => a + b, 0);
  }

  private getSurfacePosition(xMap: number, yMap: number): SurfacePoint {
    const empty: SurfacePoint = {
      x: xMap,
      y: yMap,
      height: -0.1,
    };

    if (xMap > this.mapSize-1 || yMap > this.mapSize-1) {
      return empty;
    }

    if (xMap < 0 || yMap < 0) {
      return empty;
    }

    return this._surfaceMap[xMap][yMap];
  }

  private getZCordByLocation(area: SurfaceMapLocation): number {
    const {x, y} = area.position;
    const height = this.getHeightByLocation(area);
    return this.getZCordByPosition({x, y, height});
  }

  private getZCordByPosition({height}: SurfacePoint): number {
    return VMath.lerp(height, -150, 150);
  }
}
