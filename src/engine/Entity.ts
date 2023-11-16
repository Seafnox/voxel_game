import { EntityEvent } from 'src/engine/EntityEvent';
import { PropertyChangeEvent } from 'src/engine/PropertyChangeEvent';
import { Controller, ControllerConstructor } from './Controller';
import { TopicEmitter } from 'src/emitter/TopicEmitter';
import { GameEngine } from './GameEngine';

export interface EntityConstructor<TEntity extends Entity> {
  new(gameEngine: GameEngine, name: string): TEntity;
}

export class Entity extends TopicEmitter {
  private controllers: Record<string, Controller> = {};
  private _isActive = false;
  private _properties: Record<string, unknown> = {};

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

  get engine(): GameEngine {
    return this._gameEngine;
  }

  get name(): string {
    return this._name;
  }

  get constructorName(): string {
    return this.constructor.name;
  }

  hasProperty(name: string): boolean {
    return name in this._properties;
  }

  getProperty<T>(name: string): T {
    if (!(name in this._properties)) {
      throw new Error(`Can't read property '${name}' from  ${this.constructorName} '${this.name}'`)
    }

    return this._properties[name] as T;
  }

  setProperty<T>(name: string, value: T, specialEventName?: string) {
    if (this._properties[name] === value) return;

    const prev = this._properties[name] as T;
    this._properties[name] = value;

    this.emit<PropertyChangeEvent<T>>(EntityEvent.PropertyChange, {
      prev,
      next: value,
    });

    if (specialEventName) {
      this.emit<PropertyChangeEvent<T>>(specialEventName, {
        prev,
        next: value,
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  create<TController extends Controller>(constructor: ControllerConstructor<TController>, as?: Function): TController {
    const name = as?.name || constructor.name;
    const controller = new constructor(this._gameEngine, this, name);
    this.controllers[controller.name] = controller;

    return controller;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  get<TController extends Controller>(constructor: Function): TController {
    return this.controllers[constructor.name] as TController;
  }

  broadcast<TEventData>(eventName: string, eventData: TEventData) {
    this.emit(eventName, eventData);
  }

  update(deltaTime: number) {
    Object.values(this.controllers).forEach(component => component.update && component.update(deltaTime));
  }
}
