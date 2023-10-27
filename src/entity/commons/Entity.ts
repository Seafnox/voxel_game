import { Vector3, Quaternion, Object3D } from 'three';
import { Component } from './Component';
import { Emittable } from './Emittable';
import { EmittedEvent } from './EmittedEvent';
import { EntityManager } from './EntityManager';
import {isFunction} from "../../utils/isFunction";
import {EntityTopic} from "./EntityTopic";
import {LogMethod} from "../../utils/logger/LogMethod";
import {LogAction} from "../../utils/logger/LogAction";
import {Level} from "../../utils/logger/Level";

export class Entity extends Emittable {
  name?: string;
  entityManager?: EntityManager;
  private components: Record<string, Component> = {}; // SET OF COMPONENTS
  private position = new Vector3();
  private rotation = new Quaternion();
  private model?: Object3D;
  private _isModelReady = false;

  disactivate() {
    this.entityManager?.disactivate(this);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  AddComponent(component: Component, as?: Function) {
    component.entity = this;
    const registeredAs = as || component.constructor;
    this.components[registeredAs.name] = component;

    // eslint-disable-next-line @typescript-eslint/unbound-method
    isFunction(component.onEntityChange) && component.onEntityChange();
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  getComponent<TComponent extends Component>(constructor: Function): TComponent {
    return this.components[constructor.name] as TComponent;
  }

  // FIXME simplify event and emit only left alive
  broadcast<TEventData>(msg: EmittedEvent<TEventData>) {
    this.emit(msg.topic, msg);
  }

  // FIXME make getter and setter after refactoring
  getPosition(): Vector3 {
    return this.position;
  }

  setPosition(p: Vector3) {
    this.position.copy(p);
    this.broadcast({
      topic: 'update.position',
      value: this.position,
    });
  }

  // FIXME make getter and setter after refactoring
  getRotation(): Quaternion {
    return this.rotation;
  }

  setRotation(r: Quaternion) {
    this.rotation.copy(r);
    this.broadcast({
      topic: 'update.rotation',
      value: this.rotation,
    });
  }

  update(deltaTime: number) {
    Object.values(this.components).forEach(component => component.update(deltaTime));
  }

  set isModelReady(value: boolean) {
    this._isModelReady = value;
    this.broadcast<boolean>({
      topic: EntityTopic.ModelLoaded,
      value: this._isModelReady,
    });
  }

  get isModelReady(): boolean {
    return this._isModelReady;
  }
}
