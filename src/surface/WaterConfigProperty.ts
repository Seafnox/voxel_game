import { GameEngine } from 'src/engine/GameEngine';
import { GlobalProperty } from 'src/engine/GlobalProperty';
import { Vector3 } from 'three';

export interface WaterConfig {
  mapSize: number;
  waterWaveSize: number;
  waterWaveScale: number;
  level: Vector3;
}

export class WaterConfigProperty extends GlobalProperty<WaterConfig> {
  constructor(
    engine: GameEngine,
    value: WaterConfig = {
      mapSize: 0,
      waterWaveSize: 0,
      waterWaveScale: 0,
      level: new Vector3(0,0,0),
    },
  ) {
    super(engine, value);
  }

  partialSet(value: Partial<WaterConfig>) {
    this.set({
      ...this.get(),
      ...value,
    })
  }
}
