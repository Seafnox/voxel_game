import { GameEngine } from 'src/engine/GameEngine';
import { GlobalProperty } from 'src/engine/GlobalProperty';
import { Vector3 } from 'three';

export class GravityProperty extends GlobalProperty<Vector3> {
  constructor(
    engine: GameEngine,
    value: Vector3 = new Vector3(0, -40, 0),
  ) {
    super(engine, value);
  }
}
