import { AnimationAction } from 'three';
import { VisualEntityTopic } from '../../commons/VisualEntityTopic';
import { ModelController } from '../../models/ModelController';
import { VisualEntity } from '../../commons/VisualEntity';
import { Disposable } from 'src/emitter/SimpleEmitter';
import { SimpleState } from '../../commons/state/SimpleState';
import { StateMachine } from '../../commons/state/StateMachine';

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
    this.modelDisposable = this.entity.on<boolean>(VisualEntityTopic.ModelLoaded, () => this.getModelAndRunAnimation());
  }

  exit(/* nextState: SimpleState */): void {
    this.modelDisposable?.dispose();
  }

  validate(/* deltaTime: number, input: StateInput */): void {
  }

  private getModelAndRunAnimation() {
    const modelController = this.entity.get<ModelController>(ModelController);
    if (!modelController.getAnimationList().includes(this.animationName)) {
      throw new Error(`No '${this.animationName}' animation in entity '${this.entity.name}' with animation list: [${modelController.getAnimationList().join(', ')}]`);
    }

    setTimeout(() => modelController.setActiveAnimation(this.animationName));
  }
}

