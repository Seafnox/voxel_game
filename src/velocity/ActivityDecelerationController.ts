import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { EntityActivityStatus } from 'src/activity/EntityActivityStatus';
import { ActivityStatusProperty } from 'src/activity/ActivityProperties';
import { DecelerationProperty, VelocityProperty } from 'src/velocity/VelocityProperties';
import { TickSystem, TickSystemEvent } from 'src/browser/TickSystem';
import { Vector3 } from 'three';

export class ActivityDecelerationController extends Controller {
  private defaultDeceleration = new Vector3(0.0, 0.0, 0.0);
  private totalDeceleration = new Vector3(-1, -0.1, -1);
  private extremeDecelerationScalar = 100;

  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

    this.entity.registerProperty(DecelerationProperty, this.defaultDeceleration);
    this.engine.systems.find(TickSystem).on(TickSystemEvent.Init, this.init.bind(this));
    this.engine.systems.find(TickSystem).on(TickSystemEvent.Tick, this.tick.bind(this));
  }

  private get velocity(): Vector3 {
    return this.entity.getProperty(VelocityProperty);
  }

  private get activityStatus(): EntityActivityStatus {
    return this.entity.getProperty(ActivityStatusProperty);
  }

  init() {
    this.tick();
  }

  tick() {
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
