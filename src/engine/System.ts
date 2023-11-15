import { TopicEmitter } from 'src/emitter/TopicEmitter';
import { GameEngine } from 'src/engine/GameEngine';

export interface SystemConstructor<TSystem extends System> {
  new(gameEngine: GameEngine, name: string): TSystem
}

export class System extends TopicEmitter {
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
