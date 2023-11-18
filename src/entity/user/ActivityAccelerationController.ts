import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { UpdatePropertyEvent } from 'src/engine/UpdatePropertyEvent';
import { ActivityStatus } from 'src/entity/state/ActivityStatus';
import { ActivityProperty } from 'src/entity/user/KeyboardActivityController';
import { Vector3 } from 'three';

export const AccelerationProperty = 'acceleration';

export class ActivityAccelerationController extends Controller {
  private defaultAcceleration = new Vector3(0.0, 0.0, 0.0);
  private totalAcceleration = new Vector3(10.0, 20.0, 50.0);
  private extremeAccelerationScalar = 10;

  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

    this.entity.registerProperty(AccelerationProperty, this.defaultAcceleration);

    this.entity.on(ActivityProperty, this.updateAcceleration.bind(this));
  }

  private updateAcceleration(event: UpdatePropertyEvent<ActivityStatus>) {
    const status = event.next;
    const acceleration = this.totalAcceleration.clone();
    const multiplicator = new Vector3(0, 0, 0);

    if (status.forward) {
      multiplicator.z = 1;
    }

    if (status.backward) {
      multiplicator.z = -1;
    }

    if (status.top) {
      multiplicator.y = 1;
    }

    if (status.down) {
      multiplicator.y = -1;
    }

    if (status.shift) {
      multiplicator.multiplyScalar(this.extremeAccelerationScalar);
    }

    acceleration.multiply(multiplicator);

    this.entity.setProperty(AccelerationProperty, acceleration);

  }
}
