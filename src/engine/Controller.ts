import { Entity } from './Entity';
import { GameEngine } from './GameEngine';

export interface ControllerConstructor<TController extends Controller> {
  new(engine: GameEngine, entity: Entity, name: string): TController;
}

export abstract class Controller<TEntity extends Entity = Entity> {
  constructor(
    private _engine: GameEngine,
    private _entity: TEntity,
    private _name: string,
  ) {}

  get name(): string {
    return this._name;
  }

  get entity(): TEntity {
    return this._entity;
  }

  get engine(): GameEngine {
    return this._engine;
  }

  get constructorName(): string {
    return this.constructor.name;
  }
}
