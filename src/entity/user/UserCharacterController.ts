import { ActivityStatusProperty } from 'src/entity/user/ActivityStatusController';
import { isDifferentQuaternion } from 'src/entity/utils/isDifferentQuaternion';
import { isDifferentVector } from 'src/entity/utils/isDifferentVector';
import { Quaternion, Vector3 } from 'three';
import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { ActivityStatus } from '../state/ActivityStatus';
import { VisualEntity } from '../VisualEntity';
import { StateMachine } from '../state/StateMachine';
import { IdleUserState } from './states/IdleUserState';
import { SpatialGridController } from 'src/grid/SpatialGridController';
import { WalkUserState } from './states/WalkUserState';
import { RunUserState } from './states/RunUserState';

export class UserCharacterController extends Controller<VisualEntity> {
  private deceleration = new Vector3(-5.0, -5.0, -5.0);
  private deltaTimeScalar = 1000;
  private rotationScalar = 1;
  private stateMachine = new StateMachine();

  constructor(
      engine: GameEngine,
      entity: Entity,
      name: string,
  ) {
    if (!(entity instanceof VisualEntity)) {
      throw new Error(`Can't make calculation for 3d Object in simple Entity. Use ${VisualEntity.name}`);
    }

    super(engine, entity, name);

    this.stateMachine.addState(IdleUserState);
    this.stateMachine.addState(WalkUserState);
    this.stateMachine.addState(RunUserState);

    this.stateMachine.setEntity(this.entity);
    this.stateMachine.setState(IdleUserState);
  }

  update(deltaTime: number): void {
    this.calculateRotation(deltaTime);
    this.calculateVelocity(deltaTime);
    this.calculatePosition(deltaTime);
    this.stateMachine.validateState(deltaTime, {
      velocity: this.entity.getVelocity().clone(),
      activityStatus: this.entity.getProperty<ActivityStatus>(ActivityStatusProperty),
    });
  }

  findIntersections(pos: Vector3) {
    const isAlive = (entity: Entity | undefined) => {
      // FIXME add HealthComponent or change logic
      // const health = entity.GetComponent(HealthComponent);
      // if (!health) {
      //   return true;
      // }
      // return health.health > 0;

      return !!entity && false;
    };

    const grid = this.entity?.get<SpatialGridController>(SpatialGridController);
    const nearby = grid?.FindNearbyEntities(5).filter(client => isAlive(client.entity)) || [];
    const collisions = [];

    for (let i = 0; i < nearby.length; ++i) {
      const nearbyEntity = nearby[i].entity;
      const nearbyPosition = nearbyEntity.getPosition();
      const d = ((pos.x - nearbyPosition.x) ** 2 + (pos.z - nearbyPosition.z) ** 2) ** 0.5;

      // HARDCODED
      if (d <= 4) {
        collisions.push(nearbyEntity);
      }
    }
    return collisions;
  }

  private calculateRotation(deltaTime: number) {
    const activityStatus = this.entity.getProperty<ActivityStatus>(ActivityStatusProperty);
    const rotationMultiplier = new Quaternion();
    const RotationDirection = new Vector3();
    const currentRotation = this.entity.getRotation().clone();

    if (activityStatus.left) {
      RotationDirection.set(0, 1, 0);
      rotationMultiplier.setFromAxisAngle(RotationDirection, this.rotationScalar * Math.PI * deltaTime / this.deltaTimeScalar);
      currentRotation.multiply(rotationMultiplier);
    }
    if (activityStatus.right) {
      RotationDirection.set(0, 1, 0);
      rotationMultiplier.setFromAxisAngle(RotationDirection, this.rotationScalar * -Math.PI * deltaTime / this.deltaTimeScalar);
      currentRotation.multiply(rotationMultiplier);
    }

    if (isDifferentQuaternion(this.entity.getRotation(), currentRotation)) {
      this.entity.getRotation().copy(currentRotation);
      this.entity.setRotation(this.entity.getRotation());
    }
  }

  private calculateVelocity(deltaTime: number) {
    const velocity = this.entity.getVelocity();

    const activityStatus = this.entity.getProperty<ActivityStatus>(ActivityStatusProperty);
    const frameAcceleration = this.entity.getAcceleration().clone();
    frameAcceleration.multiplyScalar(deltaTime / this.deltaTimeScalar);
    velocity.add(frameAcceleration);


    const frameDeceleration = this.getFrameDeceleration(velocity, deltaTime, activityStatus);
    velocity.add(frameDeceleration);

    // this.entity.setVelocity(velocity);
  }

  // TODO create Decceleration controller
  private getFrameDeceleration(velocity: Vector3, deltaTime: number, activityStatus: ActivityStatus) {
    const frameDeceleration = new Vector3(
      velocity.x * this.deceleration.x,
      velocity.y * (activityStatus.top || activityStatus.down ? this.deceleration.y : this.deceleration.y * 100),
      velocity.z * (activityStatus.forward || activityStatus.backward ? this.deceleration.z : this.deceleration.z * 100),
    );
    frameDeceleration.multiplyScalar(deltaTime / this.deltaTimeScalar);
    frameDeceleration.z = Math.sign(frameDeceleration.z) * Math.min(Math.abs(frameDeceleration.z), Math.abs(velocity.z));
    frameDeceleration.y = Math.sign(frameDeceleration.y) * Math.min(Math.abs(frameDeceleration.y), Math.abs(velocity.y));

    return frameDeceleration;
  }

  private calculatePosition(deltaTime: number) {
    const velocity = this.entity.getVelocity();
    const position = this.entity.getPosition();
    const rotation = this.entity.getRotation();

    const forward = new Vector3(0, 0, 1);
    forward.applyQuaternion(rotation);
    forward.normalize();

    const sideways = new Vector3(1, 0, 0);
    sideways.applyQuaternion(rotation);
    sideways.normalize();

    const verticalWays = new Vector3(0, 1, 0);
    sideways.applyQuaternion(rotation);
    sideways.normalize();

    sideways.multiplyScalar(velocity.x * deltaTime / this.deltaTimeScalar);
    verticalWays.multiplyScalar(velocity.y * deltaTime / this.deltaTimeScalar);
    forward.multiplyScalar(velocity.z * deltaTime / this.deltaTimeScalar);

    const supposedPosition = position.clone();
    supposedPosition.add(forward);
    supposedPosition.add(verticalWays);
    supposedPosition.add(sideways);

    const collisions = this.findIntersections(supposedPosition);
    if (collisions.length > 0) return;

    if (isDifferentVector(position, supposedPosition)) {
      position.copy(supposedPosition);
      this.entity.setPosition(position);
    }
  }
}
