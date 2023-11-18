import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { ActivityStatus } from 'src/entity/state/ActivityStatus';
import { ActivityProperty } from 'src/entity/user/KeyboardActivityController';
import { VisualEntityProperty } from 'src/entity/VisualEntityProperty';
import { Vector3 } from 'three';

export const DecelerationProperty = 'deceleration';

export class ActivityDecelerationController extends Controller {
  private defaultDeceleration = new Vector3(0.0, 0.0, 0.0);
  private totalDeceleration = new Vector3(-5.0, -5.0, -5.0);
  private extremeDecelerationScalar = 100;

  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

    this.entity.registerProperty(DecelerationProperty, this.defaultDeceleration);
  }

  private get velocity(): Vector3 {
    return this.entity.getProperty(VisualEntityProperty.Velocity);
  }

  private get activityStatus(): ActivityStatus {
    return this.entity.getProperty(ActivityProperty);
  }

  update() {
    const status = this.activityStatus;
    const velocity = this.velocity;
    const deceleration = this.totalDeceleration.clone();
    deceleration.multiply(velocity);

    if (!status.forward && !status.backward) {
      deceleration.x *= this.extremeDecelerationScalar;
      deceleration.z *= this.extremeDecelerationScalar;
    }

    this.entity.setProperty(DecelerationProperty, deceleration);

  }
}
