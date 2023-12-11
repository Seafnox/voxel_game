import { ModelStatusProperty } from 'src/models/ModelStatusProperty';
import { RunUserState } from 'src/player/states/RunUserState';
import { WalkUserState } from 'src/player/states/WalkUserState';
import { MinAnimatedVelocity, realVelocity, MinRunVelocity } from 'src/player/UserConfig';
import { VelocityProperty } from 'src/velocity/VelocityProperty';
import { ModelController } from 'src/models/ModelController';
import { Disposable } from 'src/emitter/SimpleEmitter';
import { SimpleState } from 'src/state/SimpleState';

export class IdleUserState extends SimpleState {
  animationName = 'idle';
  private modelDisposable?: Disposable;

  enter(/* prevState: SimpleState | undefined */): void {
    if (this.entity.properties.find(ModelStatusProperty).get()) {
      this.getModelAndRunAnimation();
      return;
    }
    this.modelDisposable = this.entity.on(ModelStatusProperty.name, () => this.getModelAndRunAnimation());
  }

  exit(/* nextState: SimpleState */): void {
    this.modelDisposable?.dispose();
  }

  validate(): void {
    const velocityVector = this.entity.properties.find(VelocityProperty).get();
    const velocity = realVelocity(velocityVector)

    if (velocity > MinAnimatedVelocity) {
      if (velocity >= MinRunVelocity) {
        this.controller.setState(WalkUserState);
        return;
      }
      this.controller.setState(RunUserState);
    }

  }

  // FIXME refactor controller requests to property requests
  private getModelAndRunAnimation() {
    const modelController = this.entity.controllers.find<ModelController>(ModelController);
    if (!modelController.getAnimationList().includes(this.animationName)) {
      throw new Error(`No '${this.animationName}' animation in entity '${this.entity.name}' with animation list: [${modelController.getAnimationList().join(', ')}]`);
    }

    modelController.setActiveAnimation(this.animationName);
  }
}

