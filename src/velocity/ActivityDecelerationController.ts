import { ActivityStatusProperty } from 'src/activity/ActivityStatusProperty';
import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { EntityActivityStatus } from 'src/activity/EntityActivityStatus';
import { DecelerationProperty } from 'src/velocity/DecelerationProperty';
import { TickSystem, TickSystemEvent } from 'src/browser/TickSystem';
import { VelocityProperty } from 'src/velocity/VelocityProperty';
import { Vector3 } from 'three';

export class ActivityDecelerationController extends Controller {
  private defaultDeceleration = new Vector3(0.0, 0.0, 0.0);
  private totalDeceleration = new Vector3(-1, -1, -1);
  private extremeDecelerationScalar = 100;

  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

    this.entity.properties.register(DecelerationProperty, this.defaultDeceleration);
    this.engine.systems.find(TickSystem).on(TickSystemEvent.Init, this.init.bind(this));
    this.engine.systems.find(TickSystem).on(TickSystemEvent.Tick, this.tick.bind(this));
  }

  private get velocity(): Vector3 {
    return this.entity.properties.find(VelocityProperty).get();
  }

  private get activityStatus(): EntityActivityStatus {
    return this.entity.properties.find(ActivityStatusProperty).get();
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

    this.entity.properties.find(DecelerationProperty).set(deceleration);

  }
}
