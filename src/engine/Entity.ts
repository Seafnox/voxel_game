import { TopicEmitter } from 'src/emitter/TopicEmitter';
import { ControllerManager } from 'src/engine/ControllerManager';
import { PropertyManager } from 'src/engine/PropertyManager';
import { GameEngine } from './GameEngine';

export interface EntityConstructor<TEntity extends Entity> {
  new(gameEngine: GameEngine, name: string): TEntity;
}

export class Entity extends TopicEmitter {
  private readonly controllerManager: ControllerManager;
  private readonly propertyManager: PropertyManager;

  constructor(
    protected _engine: GameEngine,
    protected _name: string,
  ) {
    super();

    this.controllerManager = new ControllerManager(this._engine, this);
    this.propertyManager = new PropertyManager(this);
  }

  get engine(): GameEngine {
    return this._engine;
  }

  get name(): string {
    return this._name;
  }

  get controllers(): ControllerManager {
    return this.controllerManager;
  }

  get properties(): PropertyManager {
    return this.propertyManager;
  }
}
