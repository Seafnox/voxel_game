import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { AccelerationProperty } from 'src/entity/ActivityAccelerationController';
import { DecelerationProperty } from 'src/entity/ActivityDecelerationController';
import { GravityAccelerationProperty } from 'src/entity/GravityAccelerationController';
import { Vector3 } from 'three';

export const VelocityProperty = 'velocity';

export class VelocityController extends Controller {
  private deltaTimeScalar = 1000;
  private defaultVelocity = new Vector3(0, 0, 0);
  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

    this.entity.registerProperty(VelocityProperty, this.defaultVelocity);
  }

  update(deltaTime: number) {
    const velocity = this.entity.getProperty<Vector3>(VelocityProperty);

    const gravityAcceleration = this.entity.getProperty<Vector3>(GravityAccelerationProperty).clone();
    const frameAcceleration = this.entity.getProperty<Vector3>(AccelerationProperty).clone();
    frameAcceleration.add(gravityAcceleration);
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
