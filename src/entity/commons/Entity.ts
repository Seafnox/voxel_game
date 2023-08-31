import { Vector3, Quaternion, Object3D } from 'three';
import { Component } from './Component';
import { Emittable } from './Emittable';
import { EmittedEvent } from './EmittedEvent';
import { EntityManager } from './EntityManager';
import {isFunction} from "../../utils/isFunction";

export class Entity extends Emittable {
  name?: string;
  entityManager?: EntityManager;
  private components: Record<string, Component> = {}; // SET OF COMPONENTS
  private position = new Vector3();
  private rotation = new Quaternion();
  private model?: Object3D;

  disactivate() {
    this.entityManager?.disactivate(this);
  }

  AddComponent(component: Component) {
    component.entity = this;
    this.components[component.constructor.name] = component;

    // eslint-disable-next-line @typescript-eslint/unbound-method
    isFunction(component.onEntityChange) && component.onEntityChange();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getComponent<TComponent extends Component>(constructor: { new(...args: any[]): TComponent }): TComponent {
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

  update(timeElapsed: number) {
    Object.values(this.components).forEach(component => component.update(timeElapsed));
  }

  public setModel(model: Object3D) {
    this.model = model;
    this.broadcast<Object3D>({
      topic: 'load.character',
      value: this.model,
    });

  }
}
