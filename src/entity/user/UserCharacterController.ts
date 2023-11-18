import { ActivityProperty } from 'src/entity/user/KeyboardActivityController';
import { RotationProperty } from 'src/entity/user/ActivityRotationController';
import { VelocityProperty } from 'src/entity/user/VelocityController';
import { isDifferentVector } from 'src/entity/utils/isDifferentVector';
import { Vector3, Quaternion } from 'three';
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
  private deltaTimeScalar = 1000;
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
    this.calculatePosition(deltaTime);
    this.stateMachine.validateState(deltaTime, {
      velocity: this.entity.getProperty<Vector3>(VelocityProperty).clone(),
      activityStatus: this.entity.getProperty<ActivityStatus>(ActivityProperty),
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

  private calculatePosition(deltaTime: number) {
    const velocity = this.entity.getProperty<Vector3>(VelocityProperty);
    const position = this.entity.getPosition();
    const rotation = this.entity.getProperty<Quaternion>(RotationProperty)

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
