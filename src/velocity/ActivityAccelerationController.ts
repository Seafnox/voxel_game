import { ActivityStatusProperty } from 'src/activity/ActivityStatusProperty';
import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { UpdatePropertyEvent } from 'src/engine/UpdatePropertyEvent';
import { EntityActivityStatus } from 'src/activity/EntityActivityStatus';
import { AccelerationProperty } from 'src/velocity/AccelerationProperty';
import { Vector3 } from 'three';

export class ActivityAccelerationController extends Controller {
  private defaultAcceleration = new Vector3(0.0, 0.0, 0.0);
  private totalAcceleration = new Vector3(2.0, 60.0, 8.0);
  private extremeAccelerationScalar = 5;

  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

    this.entity.properties.register(AccelerationProperty, this.defaultAcceleration);

    this.entity.on(ActivityStatusProperty.name, this.updateAcceleration.bind(this));
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
      multiplicator.x *= this.extremeAccelerationScalar;
      multiplicator.z *= this.extremeAccelerationScalar;
    }

    acceleration.multiply(multiplicator);

    this.entity.properties.find(AccelerationProperty).set(acceleration);

  }
}
