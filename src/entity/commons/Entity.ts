import { Controller } from './Controller';
import { Emittable } from './emitter/Emittable';
import { EmittedEvent } from './emitter/EmittedEvent';
import { EntityManager } from './EntityManager';
import { isFunction } from '../../utils/isFunction';

export class Entity extends Emittable {
  name?: string;
  entityManager?: EntityManager;
  private controllers: Record<string, Controller> = {}; // SET OF COMPONENTS

  disactivate() {
    this.entityManager?.disactivate(this);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  AddController(controller: Controller, as?: Function) {
    controller.entity = this;
    const registeredAs = as || controller.constructor;
    this.controllers[registeredAs.name] = controller;

    // eslint-disable-next-line @typescript-eslint/unbound-method
    isFunction(controller.onEntityChange) && controller.onEntityChange();
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  getComponent<TComponent extends Controller>(constructor: Function): TComponent {
    return this.controllers[constructor.name] as TComponent;
  }

  // FIXME simplify event and emit only left alive
  broadcast<TEventData>(msg: EmittedEvent<TEventData>) {
    this.emit(msg.topic, msg);
  }

  update(deltaTime: number) {
    Object.values(this.controllers).forEach(component => component.update(deltaTime));
  }
}
