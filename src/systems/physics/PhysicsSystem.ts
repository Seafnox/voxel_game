import { Emittable } from '../../emitter/Emittable';
import { System } from '../commons/System';
import { SystemManager } from '../commons/SystemManager';

export class PhysicsSystem extends Emittable implements System {
  name!: string;
  systemManager!: SystemManager;

  private _isActive = true;

  constructor(
  ) {
    super();
  }

  public get isActive(): boolean {
    return this._isActive;
  }

}
