import { RandomFn } from 'simplex-noise/simplex-noise';
import { EventSystem } from 'src/engine/EventSystem';
import { GameEngine } from 'src/engine/GameEngine';
import { pointToPosition } from 'src/surface/pointToPosition';
import { positionToPoint } from 'src/surface/positionToPoint';
import { SurfaceConfig } from 'src/surface/SurfaceConfig';
import { SurfaceConfigProperty } from 'src/surface/SurfaceConfigProperty';
import { SurfaceMapProperty } from 'src/surface/SurfaceMapProperty';
import { SurfacePointLocation } from 'src/surface/SurfacePointLocation';
import { SurfaceType } from 'src/surface/SurfaceType';
import { SurfaceTypeConfig } from 'src/surface/SurfaceTypeConfig';
import { VMath } from 'src/VMath';
import { SurfaceBuilder, SurfacePoint, SurfaceMap } from 'src/surface/SurfaceBuilder';

export class SurfaceHelperSystem extends EventSystem {
  private surfaceConfig: SurfaceConfigProperty;
  private surfaceMap: SurfaceMapProperty;

  constructor(
    engine: GameEngine,
    name: string,
  ) {
    super(engine, name);

    this.surfaceConfig = this.engine.properties.find(SurfaceConfigProperty);
    this.surfaceMap = this.engine.properties.find(SurfaceMapProperty);
  }

  get mapSize(): number {
    return this.surfaceConfig.mapSize;
  }

  get surfaceSize(): number {
    return this.surfaceConfig.surfaceSize;
  }

  get surfaceScale(): number {
    return this.surfaceConfig.surfaceScale;
  }

  get surface(): SurfaceMap {
    return this.surfaceMap.get();
  }

  generateSurface(
    randomFn: RandomFn,
    mapSize: number,
    surfaceSize: number,
  ) {
    this.surfaceConfig.set({
      mapSize,
      surfaceSize,
      surfaceScale: this.surfaceSize / this.mapSize,
    });
    const surfaceBuilder = new SurfaceBuilder(randomFn, 0.003 * this.surfaceScale);
    this.surfaceMap.set(surfaceBuilder.getSurfaceMap(this.mapSize, this.mapSize));
  }

  getZCord(xCord: number, yCord: number): number {
    return this.getZCordByLocation(this.getSurfaceLocation(xCord, yCord))
  }

  getSurfaceUnit(x: number, y: number): number {
    return this.getSurfaceUnitByLocation(this.getSurfacePointLocation(x, y));
  }

  getSurfaceType(xCord: number, yCord: number): SurfaceType {
    return this.getSurfaceTypeByLocation(this.getSurfaceLocation(xCord, yCord));
  }

  getSurfacePointColor(x: number, y: number): number {
    return this.surfaceUnitToColor(this.getSurfaceUnit(x, y));
  }

  getCordToMap(position: number): number {
    return positionToPoint(position, this.mapSize, this.surfaceSize);
  }

  getMapToCord(point: number): number {
    return pointToPosition(point, this.mapSize, this.surfaceSize);
  }

  getSurfaceLocation(xCord: number, yCord: number): SurfacePointLocation {
    const x = this.getCordToMap(xCord);
    const y = this.getCordToMap(yCord);

    return this.getSurfacePointLocation(x,y);
  }

  getSurfacePointLocation(x: number, y: number): SurfacePointLocation {
    const bottomX = Math.floor(x);
    const leftY = Math.floor(y);
    const topX = bottomX === x ? x : bottomX + 1;
    const rightY = leftY === y ? y : leftY + 1;

    return {
      leftTop: this.getSurfacePoint(topX, leftY),
      leftBottom: this.getSurfacePoint(bottomX, leftY),
      rightTop: this.getSurfacePoint(topX, rightY),
      rightBottom: this.getSurfacePoint(bottomX, rightY),
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

  private getSurfaceLocationConfig(unit: number): [SurfaceTypeConfig, SurfaceTypeConfig] {
    const maxIndex = SurfaceConfig.findIndex(checked => checked.maxUnit >= unit);

    if (maxIndex <= 0) return [SurfaceConfig[0], SurfaceConfig[0]];

    return [SurfaceConfig[maxIndex-1], SurfaceConfig[maxIndex]];
  }

  private getSurfaceUnitByLocation(area: SurfacePointLocation): number {
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

  private getSurfacePoint(xMap: number, yMap: number): SurfacePoint {
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

    return this.surfaceMap.get()[xMap][yMap];
  }

  private getZCordByLocation(area: SurfacePointLocation): number {
    const {x, y} = area.position;
    const unit = this.getSurfaceUnitByLocation(area);
    return this.getZCordByPoint({x, y, unit});
  }

  private getSurfaceTypeByLocation(area: SurfacePointLocation): SurfaceType {
    const unit = this.getSurfaceUnitByLocation(area);
    return this.surfaceUnitToSurfaceConfig(unit).type;
  }

  private getZCordByPoint({unit}: SurfacePoint): number {
    const [prev, next] = this.getSurfaceLocationConfig(unit);
    const minZ = prev.maxHeight;
    const minUnit = prev.maxUnit;
    const maxZ = next.maxHeight;
    const maxUnit = next.maxUnit;
    const normal = VMath.revertLerp(unit, minUnit, maxUnit);
    return VMath.lerp(normal, minZ, maxZ);
  }
}
