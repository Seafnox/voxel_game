import { ModelReadyProperty } from 'src/models/ModelProperties';
import { RunUserState } from 'src/player/states/RunUserState';
import { WalkUserState } from 'src/player/states/WalkUserState';
import { MinAnimatedVelocity, realVelocity, MinRunVelocity } from 'src/player/UserConfig';
import { VelocityProperty } from 'src/velocity/VelocityProperties';
import { Vector3 } from 'three';
import { ModelController } from 'src/models/ModelController';
import { Disposable } from 'src/emitter/SimpleEmitter';
import { SimpleState } from 'src/state/SimpleState';

export class IdleUserState extends SimpleState {
  animationName = 'idle';
  private modelDisposable?: Disposable;

  enter(/* prevState: SimpleState | undefined */): void {
    if (this.entity.getProperty<boolean>(ModelReadyProperty)) {
      this.getModelAndRunAnimation();
      return;
    }
    this.modelDisposable = this.entity.on(ModelReadyProperty, () => this.getModelAndRunAnimation());
  }

  exit(/* nextState: SimpleState */): void {
    this.modelDisposable?.dispose();
  }

  validate(): void {
    const velocityVector = this.entity.getProperty<Vector3>(VelocityProperty);
    const velocity = realVelocity(velocityVector)

    if (velocity > MinAnimatedVelocity) {
      if (velocity >= MinRunVelocity) {
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

    modelController.setActiveAnimation(this.animationName);
  }
}

