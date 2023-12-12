import { RandomFn } from 'simplex-noise/simplex-noise';
import { Factor } from 'src/engine/Factor';
import { SurfaceConfig } from 'src/surface/SurfaceConfig';
import { SurfaceTypeConfig } from 'src/surface/SurfaceTypeConfig';
import { VMath } from 'src/VMath';
import { SurfaceMap, SurfaceBuilder, SurfacePoint } from 'src/surface/SurfaceBuilder';

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

  getSurfaceUnit(x: number, y: number): number {
    return this.getUnitByLocation(this.getSurfaceMapLocation(x, y));
  }

  getSurfacePointColor(x: number, y: number): number {
    return this.surfaceUnitToColor(this.getSurfaceUnit(x, y));
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

  private surfaceUnitToColor(unit: number): number {
    const surfaceTypeConfig = this.surfaceUnitToSurfaceConfig(unit);
    return surfaceTypeConfig?.color; // бездна;
  }

  private surfaceUnitToSurfaceConfig(unit: number): SurfaceTypeConfig {
    return SurfaceConfig.find(checked => checked.maxUnit >= unit) || SurfaceConfig[0];
  }

  private getSurfaceConfigBetween(unit: number): [SurfaceTypeConfig, SurfaceTypeConfig] {
    const maxIndex = SurfaceConfig.findIndex(checked => checked.maxUnit >= unit);

    if (maxIndex <= 0) return [SurfaceConfig[0], SurfaceConfig[0]];

    return [SurfaceConfig[maxIndex-1], SurfaceConfig[maxIndex]];
  }

  private getUnitByLocation(area: SurfaceMapLocation): number {
    const {x: leftX, y: bottomY} = area.leftBottom;
    const bottomDiff = Math.abs(area.position.x - leftX);
    const topDiff = 1 - bottomDiff;
    const leftDiff = Math.abs(area.position.y - bottomY);
    const rightDiff = 1 - leftDiff;
    const leftTopHeight = area.leftTop.unit;
    const leftBottomHeight = area.leftBottom.unit;
    const rightTopHeight = area.rightTop.unit;
    const rightBottomHeight = area.rightBottom.unit;

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
      unit: -0.1,
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
    const unit = this.getUnitByLocation(area);
    return this.getZCordByPosition({x, y, unit});
  }

  private getZCordByPosition({unit}: SurfacePoint): number {
    const [prev, next] = this.getSurfaceConfigBetween(unit);
    // debugger;
    const minZ = prev.maxHeight;
    const minUnit = prev.maxUnit;
    const maxZ = next.maxHeight;
    const maxUnit = next.maxUnit;
    const normal = VMath.revertLerp(unit, minUnit, maxUnit);
    return VMath.lerp(normal, minZ, maxZ);
  }
}
