import {Object3D, Quaternion, Vector3} from "three";
import {Component} from "../commons/Component";
import {Entity} from "../commons/Entity";
import {UserInputController} from "./UserInputController";
import {StateMachine} from "../commons/StateMachine";
import {IdleUser} from "./states/IdleUser";
import {SpatialGridController} from "../../grid/SpatialGridController";
import {LogMethod} from "../../utils/logger/LogMethod";
import {Level} from "../../utils/logger/Level";
import {ModelController} from "../models/ModelController";
import {VisualEntity} from "../commons/VisualEntity";

export const enum UserState {
  Idle,
  Move,
  Run,
  Slash,
  Dead,
}

export const enum UserTurning {
  Left,
  Right,
}

export class UserCharacterController implements Component {
  private deceleration = new Vector3(-0.0005, -0.0005, -5.0);
  private acceleration = new Vector3(1, 0.125, 50.0);
  private deltaTimeScalar = 1000;
  private extremeAccelerationScalar = 2;
  private rotationScalar = 0.03;
  private stateMachine = new StateMachine();
  private userInput = new UserInputController();
  private modelComponent: ModelController | undefined;
  entity: VisualEntity | undefined;

  constructor() {
    this.stateMachine.addState(IdleUser);
  }

  @LogMethod({level: Level.info})
  onEntityChange() {
    this.stateMachine.setEntity(this.entity!);
    this.stateMachine.setState(IdleUser.name);
    this.modelComponent = this.entity?.getComponent(ModelController);
  }

  update(deltaTime: number): void {
    this.stateMachine.validateState(deltaTime, {});
    this.calculateRotation(deltaTime);
    this.calculateVelocity(deltaTime);
    this.calculatePosition(deltaTime);
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

    const grid = this.entity?.getComponent<SpatialGridController>(SpatialGridController);
    const nearby = grid?.FindNearbyEntities(5).filter(client => isAlive(client.entity)) || [];
    const collisions = [];

    for (let i = 0; i < nearby.length; ++i) {
      const nearbyEntity = nearby[i].entity!;
      const nearbyPosition = nearbyEntity.getPosition();
      const d = ((pos.x - nearbyPosition.x) ** 2 + (pos.z - nearbyPosition.z) ** 2) ** 0.5;

      // HARDCODED
      if (d <= 4) {
        collisions.push(nearby[i].entity);
      }
    }
    return collisions;
  }

  private getModel(): Object3D | undefined {
    if (!this.modelComponent) {
      console.log(this);
      throw new Error(`Can't find modelComponent in ${this.constructor.name}`);
    }

    return this.modelComponent.getModel();
  }

  private normalizeVelocity(deltaTime: number) {
    if (!this.entity) return;

    const velocity = this.entity.getVelocity();
    const frameDeceleration = new Vector3(
      velocity.x * this.deceleration.x,
      velocity.y * this.deceleration.y,
      velocity.z * this.deceleration.z
    );
    frameDeceleration.multiplyScalar(deltaTime/this.deltaTimeScalar);
    frameDeceleration.z = Math.sign(frameDeceleration.z) * Math.min(Math.abs(frameDeceleration.z), Math.abs(velocity.z));

    velocity.add(frameDeceleration);
  }

  private calculateRotation(deltaTime: number) {
    const target = this.getModel();
    if (!target) return;

    const input = this.userInput;
    const rotationMultiplier = new Quaternion();
    const RotationDirection = new Vector3();
    const currentRotation = target.quaternion.clone();

    if (input.left) {
      RotationDirection.set(0, 1, 0);
      rotationMultiplier.setFromAxisAngle(RotationDirection, this.rotationScalar * Math.PI * deltaTime * this.acceleration.y);
      currentRotation.multiply(rotationMultiplier);
    }
    if (input.right) {
      RotationDirection.set(0, 1, 0);
      rotationMultiplier.setFromAxisAngle(RotationDirection, this.rotationScalar * -Math.PI * deltaTime * this.acceleration.y);
      currentRotation.multiply(rotationMultiplier);
    }

    target.quaternion.copy(currentRotation);
    this.entity!.setRotation(target.quaternion);
  }

  private calculateVelocity(deltaTime: number) {
    if (!this.entity) return;

    const velocity = this.entity.getVelocity();
    const input = this.userInput;

    const acc = this.acceleration.clone();
    if (input.shift) {
      acc.multiplyScalar(this.extremeAccelerationScalar);
    }

    if (input.forward) {
      velocity.z += acc.z * deltaTime/this.deltaTimeScalar;
    }
    if (input.backward) {
      velocity.z -= acc.z * deltaTime/this.deltaTimeScalar;
    }

    this.normalizeVelocity(deltaTime);
  }

  private calculatePosition(deltaTime: number) {
    const target = this.getModel();

    if (!target) return;
    if (!this.entity) return;

    const velocity = this.entity.getVelocity();

    const oldPosition = new Vector3();
    oldPosition.copy(target.position);

    const forward = new Vector3(0, 0, 1);
    forward.applyQuaternion(target.quaternion);
    forward.normalize();

    const sideways = new Vector3(1, 0, 0);
    sideways.applyQuaternion(target.quaternion);
    sideways.normalize();

    sideways.multiplyScalar(velocity.x * deltaTime/this.deltaTimeScalar);
    forward.multiplyScalar(velocity.z * deltaTime/this.deltaTimeScalar);

    const pos = target.position.clone();
    pos.add(forward);
    pos.add(sideways);

    const collisions = this.findIntersections(pos);
    if (collisions.length > 0)  return;

    target.position.copy(pos);

    this.entity?.setPosition(target.position);
  }
}
