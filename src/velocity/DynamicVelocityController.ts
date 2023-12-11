import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { AccelerationProperty } from 'src/velocity/AccelerationProperty';
import { DecelerationProperty } from 'src/velocity/DecelerationProperty';
import { GravityFactor } from 'src/velocity/GravityFactor';
import { TickSystem, TickSystemEvent } from 'src/browser/TickSystem';
import { VelocityProperty } from 'src/velocity/VelocityProperty';
import { Vector3 } from 'three';

export class DynamicVelocityController extends Controller {
  private deltaTimeScalar = 1000;
  private defaultVelocity = new Vector3(0, -100, 0);
  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

    this.entity.properties.register(VelocityProperty, this.defaultVelocity);
//    this.engine.systems.find(TickSystem).on(TickSystemEvent.Init, this.init.bind(this));
    this.engine.systems.find(TickSystem).on(TickSystemEvent.Tick, this.tick.bind(this));
  }

  get gravityAcceleration(): Vector3 {
    return this.engine.factors.find(GravityFactor).gravity.clone();
  }

  tick(deltaTime: number) {
    const velocityProperty = this.entity.properties.find(VelocityProperty);
    const velocity = velocityProperty.get();

    const frameAcceleration = this.entity.properties.find(AccelerationProperty).get().clone();
    frameAcceleration.add(this.gravityAcceleration);
    frameAcceleration.multiplyScalar(deltaTime / this.deltaTimeScalar);

    velocity.add(frameAcceleration);

    const frameDeceleration = this.getFrameDeceleration(velocity, deltaTime);

    velocity.add(frameDeceleration);

    velocityProperty.set(velocity);
  }

  private getFrameDeceleration(velocity: Vector3, deltaTime: number) {
    const frameDeceleration = this.entity.properties.find(DecelerationProperty).get().clone();
    frameDeceleration.multiplyScalar(deltaTime / this.deltaTimeScalar);
    frameDeceleration.x = Math.sign(frameDeceleration.x) * Math.min(Math.abs(frameDeceleration.x), Math.abs(velocity.x));
    frameDeceleration.y = Math.sign(frameDeceleration.y) * Math.min(Math.abs(frameDeceleration.y), Math.abs(velocity.y));
    frameDeceleration.z = Math.sign(frameDeceleration.z) * Math.min(Math.abs(frameDeceleration.z), Math.abs(velocity.z));

    return frameDeceleration;
  }
}
