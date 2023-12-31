import { ActivityStatusProperty } from 'src/activity/ActivityStatusProperty';
import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { EntityActivityStatus } from 'src/activity/EntityActivityStatus';
import { KeyboardEventSystem, KeyboardTopic } from 'src/browser/KeyboardEventSystem';

export class KeyboardActivityController extends Controller {
  defaultValue: EntityActivityStatus = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    top: false,
    down: false,
    jump: false,
    shift: false,
    push: false,
    hit: false,
  };

  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

    this.entity.properties.register(ActivityStatusProperty, this.defaultValue);

    const keyBoardEventSystem = this.engine.systems.find(KeyboardEventSystem);

    keyBoardEventSystem.on(KeyboardTopic.KeyDown, this.onKeyDown.bind(this));
    keyBoardEventSystem.on(KeyboardTopic.KeyUp, this.onKeyUp.bind(this));
  }

  private onKeyDown(event: KeyboardEvent) {
    const activityStatus = this.entity.properties.find(ActivityStatusProperty);
    activityStatus.set({
      ...activityStatus.get(),
      ...this.getChange(event.keyCode, true),
    });
  }

  private onKeyUp(event: KeyboardEvent) {
    const activityStatus = this.entity.properties.find(ActivityStatusProperty);
    activityStatus.set({
      ...activityStatus.get(),
      ...this.getChange(event.keyCode, false),
    });
  }

  private getChange(actionCode: number, value: boolean): Partial<EntityActivityStatus> {
    switch (actionCode) {
      case 87: return { forward: value }; // w
      case 65: return { left: value }; // a
      case 83: return { backward: value }; // s
      case 68: return { right: value }; // d
      case 81: return { top: value }; // q
      case 69: return { down: value }; // e
      case 32: return { jump: value }; // SPACE
      case 16: return { shift: value }; // SHIFT
      default: return {};
    }
  }
}
