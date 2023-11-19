import { ActivityProperty } from 'src/entity/user/KeyboardActivityController';
import { VelocityProperty } from 'src/entity/user/VelocityController';
import { Vector3 } from 'three';
import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { ActivityStatus } from '../state/ActivityStatus';
import { VisualEntity } from '../VisualEntity';
import { StateMachine } from '../state/StateMachine';
import { IdleUserState } from './states/IdleUserState';
import { WalkUserState } from './states/WalkUserState';
import { RunUserState } from './states/RunUserState';

export class UserCharacterController extends Controller<VisualEntity> {
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
    this.stateMachine.validateState(deltaTime, {
      velocity: this.entity.getProperty<Vector3>(VelocityProperty).clone(),
      activityStatus: this.entity.getProperty<ActivityStatus>(ActivityProperty),
    });
  }
}
