import { EntityActivity } from 'src/entity/EntityActivity';
import { ActivityProperty } from 'src/entity/user/KeyboardActivityController';
import { VelocityProperty } from 'src/entity/VelocityController';
import { VisualEntityTopic } from 'src/entity/visualEntity/VisualEntityTopic';
import { Vector3 } from 'three';
import { ModelController } from '../../visualEntity/models/ModelController';
import { Disposable } from 'src/emitter/SimpleEmitter';
import { SimpleState } from '../../state/SimpleState';
import { VMath } from '../../../VMath';
import { IdleUserState } from './IdleUserState';
import { RunUserState } from './RunUserState';

export class WalkUserState extends SimpleState {
  animationName = 'walk';
  private modelDisposable?: Disposable;

  enter(): void {
    if (this.entity.isModelReady) {
      this.getModelAndRunAnimation();
      return;
    }
    this.modelDisposable = this.entity.on(VisualEntityTopic.UpdateModelReady, () => this.getModelAndRunAnimation());
  }

  exit(): void {
    this.modelDisposable?.dispose();
  }

  validate(): void {
    const velocity = this.entity.getProperty<Vector3>(VelocityProperty);
    const activity = this.entity.getProperty<EntityActivity>(ActivityProperty);

    if (velocity.length() <= VMath.epsilon) {
      this.controller.setState(IdleUserState);
      return;
    }

    if (activity.shift) {
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

