import { StateMachine } from '../../commons/state/StateMachine';
import { AnimationAction } from 'three';
import { VisualEntityTopic } from '../../commons/VisualEntityTopic';
import { ModelController } from '../../models/ModelController';
import { VisualEntity } from '../../commons/VisualEntity';
import { Disposable } from '../../../emitter/Emitter';
import { SimpleState } from '../../commons/state/SimpleState';
import { StateInput } from '../../commons/state/StateInput';
import { VMath } from '../../../VMath';
import { IdleUserState } from './IdleUserState';
import { RunUserState } from './RunUserState';

export class WalkUserState implements SimpleState {
  availableNext: SimpleState[] | undefined;
  action: AnimationAction | undefined;
  animationName = 'walk';
  private modelDisposable?: Disposable;

  constructor(
    private controller: StateMachine,
    private entity: VisualEntity,
  ) {}

  enter(/* prevState: SimpleState | undefined */): void {
    if (this.entity.isModelReady) {
      this.getModelAndRunAnimation();
      return;
    }
    this.modelDisposable = this.entity.on<boolean>(VisualEntityTopic.ModelLoaded, () => this.getModelAndRunAnimation());
  }

  exit(/* nextState: SimpleState */): void {
    this.modelDisposable?.dispose();
  }

  validate(deltaTime: number, input: StateInput): void {
    if (input.velocity.length() <= VMath.epsilon) {
      this.controller.setState(IdleUserState);
      return;
    }

    if (input.activityStatus.shift) {
      this.controller.setState(RunUserState);
    }
  }

  private getModelAndRunAnimation() {
    const modelController = this.entity.get<ModelController>(ModelController);
    if (!modelController.getAnimationList().includes(this.animationName)) {
      throw new Error(`No '${this.animationName}' animation in entity '${this.entity.name}' with animation list: [${modelController.getAnimationList().join(', ')}]`);
    }

    setTimeout(() => modelController.setActiveAnimation(this.animationName));
  }
}

