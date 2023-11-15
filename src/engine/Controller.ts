import { Entity } from './Entity';
import { GameEngine } from './GameEngine';

export interface ControllerConstructor<TController extends Controller> {
  new(engine: GameEngine, entity: Entity, name: string): TController;
}

export abstract class Controller {
  constructor(
    private _engine: GameEngine,
    private _entity: Entity,
    private _name: string,
  ) {
    // FIXME refactor and remove
    this.onEntityChange();
  }

  get name(): string {
    return this._name;
  }

  get entity(): Entity {
    return this._entity;
  }

  get engine(): GameEngine {
    return this._engine;
  }

  // FIXME refactor and remove
  onEntityChange(): void {};

  update(deltaTime: number): void {};
}
