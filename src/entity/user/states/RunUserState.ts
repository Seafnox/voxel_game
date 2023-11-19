import { ActivityStatus } from 'src/entity/state/ActivityStatus';
import { ActivityProperty } from 'src/entity/user/KeyboardActivityController';
import { VelocityProperty } from 'src/entity/user/VelocityController';
import { VisualEntityTopic } from 'src/entity/VisualEntityTopic';
import { Vector3 } from 'three';
import { ModelController } from '../../models/ModelController';
import { Disposable } from 'src/emitter/SimpleEmitter';
import { SimpleState } from '../../state/SimpleState';
import { VMath } from 'src/VMath';
import { IdleUserState } from './IdleUserState';
import { WalkUserState } from './WalkUserState';

export class RunUserState extends SimpleState {
  animationName = 'run';
  private modelDisposable?: Disposable;

  enter(): void {
    if (this.entity.isModelReady) {
      this.getModelAndRunAnimation();
      return;
    }
    this.modelDisposable = this.entity.on(VisualEntityTopic.UpdateModelReady, () => this.getModelAndRunAnimation());
  }

  exit(/* nextState: SimpleState */): void {
    this.modelDisposable?.dispose();
  }

  validate(): void {
    const velocity = this.entity.getProperty<Vector3>(VelocityProperty);
    const activity = this.entity.getProperty<ActivityStatus>(ActivityProperty);

    if (velocity.length() <= VMath.epsilon) {
      this.controller.setState(IdleUserState);
      return;
    }

    if (!activity.shift) {
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

