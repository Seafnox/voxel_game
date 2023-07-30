import { Vector3, Quaternion } from 'three';
import { Component } from './Component';
import { Emittable } from './Emittable';
import { EmittedEvent } from './EmittedEvent';
import { EntityManager } from './EntityManager';

export class Entity extends Emittable {
  name: string | undefined;
  private components: Record<string, Component> = {}; // SET OF COMPONENTS
  private position = new Vector3();
  private rotation = new Quaternion();
  entityManager: EntityManager | undefined;

  disactivate() {
    this.entityManager?.disactivate(this);
  }

  AddComponent(c: Component) {
    c.entity = this;
    this.components[c.constructor.name] = c;

    c.initComponent();
  }

  getComponent(name: string) {
    return this.components[name];
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
}
