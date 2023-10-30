import {SimpleState, StateMachine} from "../../commons/StateMachine";
import {AnimationAction} from "three";
import {LogMethod} from "../../../utils/logger/LogMethod";
import {Level} from "../../../utils/logger/Level";
import {VisualEntityTopic} from "../../commons/VisualEntityTopic";
import {ModelController} from "../../models/ModelController";
import {VisualEntity} from "../../commons/VisualEntity";

export class IdleUser implements SimpleState {
  availableNext: SimpleState[] | undefined;
  action: AnimationAction | undefined;
  idleAnimationName = 'idle';

  constructor(
    private controller: StateMachine,
    private entity: VisualEntity,
  ) {}

  @LogMethod({level: Level.info})
  enter(/* prevState: SimpleState | undefined */): void {
    if (this.entity.isModelReady) {
      this.getModelAndRunIdleAnimation();
    } else {
      this.entity.on<boolean>(VisualEntityTopic.ModelLoaded, () => {
        this.getModelAndRunIdleAnimation();
      })
    }
  }

  @LogMethod({level: Level.info})
  exit(/* nextState: SimpleState */): void {
  }

  validate(/* deltaTime: number, input: StateInput */): void {
  }

  @LogMethod({level: Level.info})
  private getModelAndRunIdleAnimation() {
    const modelController = this.entity.getComponent<ModelController>(ModelController);
    if (!modelController.getAnimationList().includes(this.idleAnimationName)) {
      throw new Error(`No '${this.idleAnimationName}' animation in entity '${this.entity.name}' with animation list: [${modelController.getAnimationList().join(', ')}]`)
    }

    setTimeout(() => modelController.setActiveAnimation(this.idleAnimationName), 1000);
  }
}

IdleUser.name;
