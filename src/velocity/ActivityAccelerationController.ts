import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { UpdatePropertyEvent } from 'src/engine/UpdatePropertyEvent';
import { EntityActivityStatus } from 'src/activity/EntityActivityStatus';
import { ActivityStatusProperty } from 'src/activity/ActivityProperties';
import { AccelerationProperty } from 'src/velocity/VelocityProperties';
import { Vector3 } from 'three';

export class ActivityAccelerationController extends Controller {
  private defaultAcceleration = new Vector3(0.0, 0.0, 0.0);
  private totalAcceleration = new Vector3(2.0, 11.0, 10.0);
  private extremeAccelerationScalar = 10;

  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

    this.entity.registerProperty(AccelerationProperty, this.defaultAcceleration);

    this.entity.on(ActivityStatusProperty, this.updateAcceleration.bind(this));
  }

  private updateAcceleration(event: UpdatePropertyEvent<EntityActivityStatus>) {
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