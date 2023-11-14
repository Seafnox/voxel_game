import { Controller } from './Controller';
import { TopicEmitter } from 'src/emitter/TopicEmitter';
import { GameEngine } from './GameEngine';
import { isFunction } from 'src/utils/isFunction';

export interface EntityConstructor<TEntity extends Entity> {
  new(gameEngine: GameEngine, name: string): TEntity;
}

export class Entity extends TopicEmitter {
  private controllers: Record<string, Controller> = {};
  private _isActive = false;

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

  // eslint-disable-next-line @typescript-eslint/ban-types
  add(controller: Controller, as?: Function) {
    controller.entity = this;
    const registeredAs = as || controller.constructor;
    this.controllers[registeredAs.name] = controller;

    // eslint-disable-next-line @typescript-eslint/unbound-method
    isFunction(controller.onEntityChange) && controller.onEntityChange();
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  get<TController extends Controller>(constructor: Function): TController {
    return this.controllers[constructor.name] as TController;
  }

  broadcast<TEventData>(topic: string, msg: TEventData) {
    this.emit(topic, msg);
  }

  update(deltaTime: number) {
    Object.values(this.controllers).forEach(component => component.update(deltaTime));
  }
}
