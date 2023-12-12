import { Vector3 } from 'three';
import { Factor } from 'src/engine/Factor';

export class GravityFactor implements Factor {
  private _gravity = new Vector3(0, -40, 0);
  public get gravity(): Vector3 {
    return this._gravity;
  }

}
