import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { AccelerationProperty, DecelerationProperty, VelocityProperty } from 'src/entity/properties/dynamic';
import { GravityFactor } from 'src/factor/GravityFactor';
import { TickSystem, TickSystemEvent } from 'src/system/TickSystem';
import { Vector3 } from 'three';

export class DynamicVelocityController extends Controller {
  private deltaTimeScalar = 1000;
  private defaultVelocity = new Vector3(0, 0, 0);
  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

    this.entity.registerProperty(VelocityProperty, this.defaultVelocity);
//    this.engine.systems.find(TickSystem).on(TickSystemEvent.Init, this.init.bind(this));
    this.engine.systems.find(TickSystem).on(TickSystemEvent.Tick, this.tick.bind(this));
  }

  get gravityAcceleration(): Vector3 {
    return this.engine.factors.find(GravityFactor).value.clone();
  }

  tick(deltaTime: number) {
    const velocity = this.entity.getProperty<Vector3>(VelocityProperty);

    const frameAcceleration = this.entity.getProperty<Vector3>(AccelerationProperty).clone();
    frameAcceleration.add(this.gravityAcceleration);
    frameAcceleration.multiplyScalar(deltaTime / this.deltaTimeScalar);

    velocity.add(frameAcceleration);

    const frameDeceleration = this.getFrameDeceleration(velocity, deltaTime);

    velocity.add(frameDeceleration);

    this.entity.setProperty(VelocityProperty, velocity);
  }

  private getFrameDeceleration(velocity: Vector3, deltaTime: number) {
    const frameDeceleration = this.entity.getProperty<Vector3>(DecelerationProperty).clone();
    frameDeceleration.multiplyScalar(deltaTime / this.deltaTimeScalar);
    frameDeceleration.x = Math.sign(frameDeceleration.x) * Math.min(Math.abs(frameDeceleration.x), Math.abs(velocity.x));
    frameDeceleration.y = Math.sign(frameDeceleration.y) * Math.min(Math.abs(frameDeceleration.y), Math.abs(velocity.y));
    frameDeceleration.z = Math.sign(frameDeceleration.z) * Math.min(Math.abs(frameDeceleration.z), Math.abs(velocity.z));

    return frameDeceleration;
  }
}
