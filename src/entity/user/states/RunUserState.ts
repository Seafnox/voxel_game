import { MinAnimatedVelocity, realVelocity, MinRunVelocity } from 'src/entity/user/UserConfig';
import { VelocityProperty } from 'src/entity/VelocityController';
import { Vector3 } from 'three';
import { ModelController, ModelReadyProperty } from '../../models/ModelController';
import { Disposable } from 'src/emitter/SimpleEmitter';
import { SimpleState } from '../../state/SimpleState';
import { IdleUserState } from './IdleUserState';
import { WalkUserState } from './WalkUserState';

export class RunUserState extends SimpleState {
  animationName = 'run';
  private modelDisposable?: Disposable;

  enter(): void {
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

    if (velocity <= MinAnimatedVelocity) {
      this.controller.setState(IdleUserState);
      return;
    }

    if (velocity < MinRunVelocity) {
      this.controller.setState(WalkUserState);
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

