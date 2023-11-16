import { StateInput } from 'src/entity/state/StateInput';
import { RunUserState } from 'src/entity/user/states/RunUserState';
import { WalkUserState } from 'src/entity/user/states/WalkUserState';
import { VMath } from 'src/VMath';
import { AnimationAction } from 'three';
import { VisualEntityEvent } from 'src/entity/VisualEntityEvent';
import { ModelController } from '../../models/ModelController';
import { VisualEntity } from '../../VisualEntity';
import { Disposable } from 'src/emitter/SimpleEmitter';
import { SimpleState } from '../../state/SimpleState';
import { StateMachine } from '../../state/StateMachine';

export class IdleUserState implements SimpleState {
  availableNext: SimpleState[] | undefined;
  action: AnimationAction | undefined;
  animationName = 'idle';
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
    this.modelDisposable = this.entity.on(VisualEntityEvent.UpdateModelReady, () => this.getModelAndRunAnimation());
  }

  exit(/* nextState: SimpleState */): void {
    this.modelDisposable?.dispose();
  }

  validate(deltaTime: number, input: StateInput): void {
    if (input.velocity.length() > VMath.epsilon) {
      if (!input.activityStatus.shift) {
        this.controller.setState(WalkUserState);
        return;
      }
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

