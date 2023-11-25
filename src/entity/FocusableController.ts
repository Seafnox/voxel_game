import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { FocusEntityProperty } from 'src/entity/properties/visual';

export class FocusableController extends Controller {
  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

    this.entity.registerProperty<Entity | undefined>(FocusEntityProperty, undefined);
  }

  focusOn(target: Entity) {
    this.entity.setProperty(FocusEntityProperty, target);
  }

  removeFocus() {
    this.entity.setProperty(FocusEntityProperty, undefined);
  }
}
