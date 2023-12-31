import { GameEngine } from 'src/engine/GameEngine';
import { GlobalProperty } from 'src/engine/GlobalProperty';
import { SurfaceMap } from 'src/surface/SurfaceBuilder';

export class SurfaceMapProperty extends GlobalProperty<SurfaceMap> {
  constructor(
    engine: GameEngine,
    value: SurfaceMap = [],
  ) {
    super(engine, value);
  }
}
