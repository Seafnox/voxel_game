import { Vector3 } from 'three';
import { Factor } from '../engine/Factor';

export class GravityFactor implements Factor {
  private _gravity = new Vector3(0, -10, 0);
  public get gravity(): Vector3 {
    return this._gravity;
  }

}
