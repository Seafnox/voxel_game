import { Component } from './Component';
import { Emittable } from './Emittable';
import { EmittedEvent } from './EmittedEvent';
import { EntityManager } from './EntityManager';
import {isFunction} from "../../utils/isFunction";

export class Entity extends Emittable {
  name?: string;
  entityManager?: EntityManager;
  private components: Record<string, Component> = {}; // SET OF COMPONENTS

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

  update(deltaTime: number) {
    Object.values(this.components).forEach(component => component.update(deltaTime));
  }
}
