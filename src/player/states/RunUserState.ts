import { ModelStatusProperty } from 'src/models/ModelStatusProperty';
import { MinAnimatedVelocity, realVelocity, MinRunVelocity } from 'src/player/UserConfig';
import { VelocityProperty } from 'src/velocity/VelocityProperty';
import { ModelController } from 'src/models/ModelController';
import { Disposable } from 'src/emitter/SimpleEmitter';
import { SimpleState } from 'src/state/SimpleState';
import { IdleUserState } from 'src/player/states/IdleUserState';
import { WalkUserState } from 'src/player/states/WalkUserState';

export class RunUserState extends SimpleState {
  animationName = 'run';
  private modelDisposable?: Disposable;

  enter(): void {
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

    if (velocity <= MinAnimatedVelocity) {
      this.controller.setState(IdleUserState);
      return;
    }

    if (velocity < MinRunVelocity) {
      this.controller.setState(WalkUserState);
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

