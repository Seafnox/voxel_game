import { GameEngine } from 'src/engine/GameEngine';
import { GlobalProperty } from 'src/engine/GlobalProperty';
import { SurfaceConfig } from 'src/surface/SurfaceConfig';

export interface SurfaceConfig {
  mapSize: number;
  surfaceSize: number;
  surfaceScale: number;
}

const defaultSurfaceConfig: SurfaceConfig = {
  mapSize: 0,
  surfaceSize: 0,
  surfaceScale: 0,
}

export class SurfaceConfigProperty extends GlobalProperty<SurfaceConfig> {
  constructor(
    engine: GameEngine,
    value: SurfaceConfig = defaultSurfaceConfig,
  ) {
    super(engine, value);
  }

  get mapSize(): number {
    return this.get().mapSize;
  }

  get surfaceSize(): number {
    return this.get().surfaceSize;
  }

  get surfaceScale(): number {
    return this.get().surfaceScale;
  }
}
