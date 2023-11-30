import { TopicEmitter } from 'src/emitter/TopicEmitter';
import { GameEngine } from 'src/engine/GameEngine';

export interface EventSystemConstructor<TSystem extends EventSystem> {
  new(gameEngine: GameEngine, name: string): TSystem
}

export class EventSystem extends TopicEmitter {
  constructor(
    protected _gameEngine: GameEngine,
    protected _name: string,
  ) {
    super();
  }

  get name(): string {
    return this._name;
  }

  get engine(): GameEngine {
    return this._gameEngine;
  }
}
