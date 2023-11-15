import { Quaternion, Vector3 } from 'three';
import { Controller } from '../../engine/Controller';
import { Entity } from '../../engine/Entity';
import { GameEngine } from '../../engine/GameEngine';
import { ActivityStatus } from '../state/ActivityStatus';
import { getVisualEntityOrThrow } from '../utils/getVisualEntityOrThrow';
import { VisualEntity } from '../VisualEntity';
import { UserActivityController } from './UserActivityController';
import { StateMachine } from '../state/StateMachine';
import { IdleUserState } from './states/IdleUserState';
import { SpatialGridController } from '../../grid/SpatialGridController';
import { LogMethod } from '../../utils/logger/LogMethod';
import { Level } from '../../utils/logger/Level';
import { WalkUserState } from './states/WalkUserState';
import { RunUserState } from './states/RunUserState';

export class UserCharacterController extends Controller {
  private deceleration = new Vector3(-5.0, -5.0, -5.0);
  private acceleration = new Vector3(10.0, 20.0, 50.0);
  private deltaTimeScalar = 1000;
  private extremeAccelerationScalar = 10;
  private rotationScalar = 1;
  private stateMachine = new StateMachine();
  private activityController = new UserActivityController();

  constructor(
      engine: GameEngine,
      entity: Entity,
      name: string,
  ) {
    super(engine, entity, name);

    this.stateMachine.addState(IdleUserState);
    this.stateMachine.addState(WalkUserState);
    this.stateMachine.addState(RunUserState);
  }

  @LogMethod({level: Level.info})
  onEntityChange() {
    this.stateMachine.setEntity(this.entity!);
    this.stateMachine.setState(IdleUserState);
  }

  update(deltaTime: number): void {
    const entity = getVisualEntityOrThrow(this, this.entity);
    this.calculateRotation(deltaTime, entity);
    this.calculateVelocity(deltaTime, entity);
    this.calculatePosition(deltaTime, entity);
    this.stateMachine.validateState(deltaTime, {
      velocity: entity.getVelocity().clone(),
      activityStatus: this.activityController.status,
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

  private calculateRotation(deltaTime: number, entity: VisualEntity) {
    if (!this.entity) return;

    const input = this.activityController.status;
    const rotationMultiplier = new Quaternion();
    const RotationDirection = new Vector3();
    const currentRotation = entity.getRotation().clone();

    if (input.left) {
      RotationDirection.set(0, 1, 0);
      rotationMultiplier.setFromAxisAngle(RotationDirection, this.rotationScalar * Math.PI * deltaTime / this.deltaTimeScalar);
      currentRotation.multiply(rotationMultiplier);
    }
    if (input.right) {
      RotationDirection.set(0, 1, 0);
      rotationMultiplier.setFromAxisAngle(RotationDirection, this.rotationScalar * -Math.PI * deltaTime / this.deltaTimeScalar);
      currentRotation.multiply(rotationMultiplier);
    }

    entity.setRotation(currentRotation);
  }

  private calculateVelocity(deltaTime: number, entity: VisualEntity) {
    if (!this.entity) return;

    const velocity = entity.getVelocity();
    const input = this.activityController.status;

    const acc = this.acceleration.clone();

    if (input.shift) {
      acc.multiplyScalar(this.extremeAccelerationScalar);
    }

    if (input.forward) {
      velocity.z += acc.z * deltaTime / this.deltaTimeScalar;
      this.stateMachine.setState(input.shift ? RunUserState : WalkUserState);
    }

    if (input.backward) {
      velocity.z -= acc.z * deltaTime / this.deltaTimeScalar;
      this.stateMachine.setState(input.shift ? RunUserState : WalkUserState);
    }

    if (input.top) {
      velocity.y += acc.y * deltaTime / this.deltaTimeScalar;
      this.stateMachine.setState(input.shift ? RunUserState : WalkUserState);
    }

    if (input.down) {
      velocity.y -= acc.y * deltaTime / this.deltaTimeScalar;
      this.stateMachine.setState(input.shift ? RunUserState : WalkUserState);
    }

    this.normalizeVelocity(velocity, deltaTime, input);
  }

  private normalizeVelocity(velocity: Vector3, deltaTime: number, input: ActivityStatus) {
    if (!this.entity) return;

    const frameDeceleration = new Vector3(
      velocity.x * this.deceleration.x,
      velocity.y * (input.top || input.down ? this.deceleration.y : this.deceleration.y * 100),
      velocity.z * (input.forward || input.backward ? this.deceleration.z : this.deceleration.z * 100),
    );
    frameDeceleration.multiplyScalar(deltaTime / this.deltaTimeScalar);
    frameDeceleration.z = Math.sign(frameDeceleration.z) * Math.min(Math.abs(frameDeceleration.z), Math.abs(velocity.z));
    frameDeceleration.y = Math.sign(frameDeceleration.y) * Math.min(Math.abs(frameDeceleration.y), Math.abs(velocity.y));

    velocity.add(frameDeceleration);
  }

  private calculatePosition(deltaTime: number, entity: VisualEntity) {
    if (!this.entity) return;

    const velocity = entity.getVelocity();
    const position = entity.getPosition();
    const rotation = entity.getRotation();

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

    const resultPosition = position.clone();
    resultPosition.add(forward);
    resultPosition.add(verticalWays);
    resultPosition.add(sideways);

    const collisions = this.findIntersections(resultPosition);
    if (collisions.length > 0) return;

    entity?.setPosition(resultPosition);
  }
}
