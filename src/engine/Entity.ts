import { TopicEmitter } from 'src/emitter/TopicEmitter';
import { Property, PropertyConstructor } from 'src/engine/Property';
import { Controller, ControllerConstructor } from './Controller';
import { GameEngine } from './GameEngine';

export interface EntityConstructor<TEntity extends Entity> {
  new(gameEngine: GameEngine, name: string): TEntity;
}

export class Entity extends TopicEmitter {
  private controllerMap: Record<string, Controller> = {};
  private _properties: Record<string, Property<unknown>> = {};

  constructor(
    protected _gameEngine: GameEngine,
    protected _name: string,
  ) {
    super();
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

  registerProperty<TValue, TProperty extends Property<TValue>>(constructor: PropertyConstructor<TValue, TProperty>, value: TValue) {
    const propertyName = constructor.name;

    if (propertyName in this._properties) {
      throw new Error(`Property '${propertyName}' already registered in ${this.constructorName} '${this.name}'`)
    }

    this._properties[propertyName] = new constructor(this, value);
  }

  hasProperty<TValue, TProperty extends Property<TValue>>(constructor: PropertyConstructor<TValue, TProperty>): boolean {
    return constructor.name in this._properties;
  }

  findProperty<TValue, TProperty extends Property<TValue>>(constructor: PropertyConstructor<TValue, TProperty>): TProperty {
    const propertyName = constructor.name;

    if (!(propertyName in this._properties)) {
      throw new Error(`Can't read property '${propertyName}' from ${this.constructorName} '${this.name}'`)
    }

    return this._properties[propertyName] as TProperty;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  create<TController extends Controller>(constructor: ControllerConstructor<TController>, as?: Function): TController {
    const name = as?.name || constructor.name;
    const controller = new constructor(this._gameEngine, this, name);
    this.controllerMap[controller.name] = controller;

    return controller;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  get<TController extends Controller>(constructor: Function): TController {
    return this.controllerMap[constructor.name] as TController;
  }

  broadcast<TEventData>(eventName: string, eventData: TEventData) {
    this.emit(eventName, eventData);
  }
}
