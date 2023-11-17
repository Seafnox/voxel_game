import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { ActivityStatus } from 'src/entity/state/ActivityStatus';
import { KeyboardEventSystem, KeyboardTopic } from 'src/system/KeyboardEventSystem';

export const ActivityStatusProperty = 'activityStatus';

export class ActivityStatusController extends Controller {
  defaultValue: ActivityStatus = {
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

    this.entity.setProperty(ActivityStatusProperty, this.defaultValue);

    const keyBoardEventSystem = this.engine.systems.find(KeyboardEventSystem);

    keyBoardEventSystem.on(KeyboardTopic.KeyDown, this.onKeyDown.bind(this));
    keyBoardEventSystem.on(KeyboardTopic.KeyUp, this.onKeyUp.bind(this));
  }

  private onKeyDown(event: KeyboardEvent) {
    const status = this.entity.getProperty<ActivityStatus>(ActivityStatusProperty);
    this.entity.setProperty(ActivityStatusProperty, {
      ...status,
      ...this.getChange(event.keyCode, true),
    });
  }

  private onKeyUp(event: KeyboardEvent) {
    const status = this.entity.getProperty<ActivityStatus>(ActivityStatusProperty);
    this.entity.setProperty(ActivityStatusProperty, {
      ...status,
      ...this.getChange(event.keyCode, false),
    });
  }

  private getChange(actionCode: number, value: boolean): Partial<ActivityStatus> {
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
