import { Vector3 } from 'three';
import { Factor } from '../entity/commons/Factor';

export class GravityFactor implements Factor<Vector3> {
  private _gravity = new Vector3(0, 10, 0);
  public get value(): Vector3 {
    return this._gravity;
  }

}
