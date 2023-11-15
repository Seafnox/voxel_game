import { StateMachine } from '../../state/StateMachine';
import { AnimationAction } from 'three';
import { VisualEntityTopic } from '../../VisualEntityTopic';
import { ModelController } from '../../models/ModelController';
import { VisualEntity } from '../../VisualEntity';
import { Disposable } from 'src/emitter/SimpleEmitter';
import { StateInput } from '../../state/StateInput';
import { SimpleState } from '../../state/SimpleState';
import { VMath } from '../../../VMath';
import { IdleUserState } from './IdleUserState';
import { WalkUserState } from './WalkUserState';

export class RunUserState implements SimpleState {
  availableNext: SimpleState[] | undefined;
  action: AnimationAction | undefined;
  animationName = 'run';
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

    if (!input.activityStatus.shift) {
      this.controller.setState(WalkUserState);
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

