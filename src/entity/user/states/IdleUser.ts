import {SimpleState, StateMachine, StateInput} from "../../commons/StateMachine";
import {Entity} from "../../commons/Entity";
import {AnimationAction} from "three";
import {LogMethod} from "../../../utils/logger/LogMethod";
import {Level} from "../../../utils/logger/Level";
import {EntityTopic} from "../../commons/EntityTopic";
import {ModelController} from "../../models/ModelController";

export class IdleUser implements SimpleState {
  availableNext: SimpleState[] | undefined;
  action: AnimationAction | undefined;

  constructor(
    private controller: StateMachine,
    private entity: Entity,
  ) {}

  @LogMethod({level: Level.info})
  enter(/* prevState: SimpleState | undefined */): void {
    if (this.entity.isModelReady) {
      this.getModelAndRunIdleAnimation();
    } else {
      this.entity.on<boolean>(EntityTopic.ModelLoaded, () => {
        this.getModelAndRunIdleAnimation();
      })
    }
  }

  @LogMethod({level: Level.info})
  exit(nextState: SimpleState): void {
  }

  @LogMethod({level: Level.info})
  validate(timeElapsed: number, input: StateInput): void {
  }

  private getModelAndRunIdleAnimation() {
    this.entity.getComponent<ModelController>(ModelController);
  }
}

IdleUser.name;
