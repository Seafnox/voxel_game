import { RandomFn } from 'simplex-noise/simplex-noise';
import { EventSystem } from 'src/engine/EventSystem';
import { GameEngine } from 'src/engine/GameEngine';
import { WaterConfigProperty } from 'src/surface/WaterConfigProperty';
import { Vector3 } from 'three';

export class WaterHelperSystem extends EventSystem {
  private waterConfig: WaterConfigProperty;

  constructor(
    engine: GameEngine,
    name: string,
  ) {
    super(engine, name);

    this.waterConfig = this.engine.properties.find(WaterConfigProperty);
  }

  configureWater(
    randomFn: RandomFn,
    mapSize: number,
    waterWaveSize: number,
  ): void {
    this.waterConfig.set({
      mapSize,
      waterWaveSize,
      waterWaveScale: waterWaveSize/mapSize,
      level: new Vector3(0,0,0),
    })
  }
}
