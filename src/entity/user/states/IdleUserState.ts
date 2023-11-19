import { EntityActivity } from 'src/entity/EntityActivity';
import { ActivityProperty } from 'src/entity/user/KeyboardActivityController';
import { RunUserState } from 'src/entity/user/states/RunUserState';
import { WalkUserState } from 'src/entity/user/states/WalkUserState';
import { VelocityProperty } from 'src/entity/VelocityController';
import { VMath } from 'src/VMath';
import { VisualEntityTopic } from 'src/entity/visualEntity/VisualEntityTopic';
import { Vector3 } from 'three';
import { ModelController } from '../../visualEntity/models/ModelController';
import { Disposable } from 'src/emitter/SimpleEmitter';
import { SimpleState } from '../../state/SimpleState';

export class IdleUserState extends SimpleState {
  animationName = 'idle';
  private modelDisposable?: Disposable;

  enter(/* prevState: SimpleState | undefined */): void {
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
    const activity = this.entity.getProperty<EntityActivity>(ActivityProperty);

    if (velocity.length() > VMath.epsilon) {
      if (!activity.shift) {
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

