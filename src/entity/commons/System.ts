import { Emittable } from 'src/emitter/Emittable';
import { GameEngine } from 'src/entity/commons/GameEngine';

export interface SystemConstructor<TSystem extends System> {
  new(gameEngine: GameEngine, name: string): TSystem
}

export class System extends Emittable {
  protected _isActive = true;
  constructor(
    protected _gameEngine: GameEngine,
    protected _name: string,
  ) {
    super();
  }

  get isActive(): boolean {
    return this._isActive;
  }

  set isActive(value: boolean) {
    this._isActive = value;
  }

  get name(): string {
    return this._name;
  }

  get engine(): GameEngine {
    return this._gameEngine;
  }
}
