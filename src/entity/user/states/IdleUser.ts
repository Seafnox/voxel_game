import {SimpleState, StateMachine, StateInput} from "../../commons/StateMachine";
import {Entity} from "../../commons/Entity";
import {AnimationAction} from "three";

export class IdleUser implements SimpleState {
  availableNext: SimpleState[] | undefined;
  action: AnimationAction | undefined;

  constructor(
    private controller: StateMachine,
    private entity: Entity,
  ) {}

  enter(prevState: SimpleState | undefined): void {
    console.log(this.constructor.name, 'enter', prevState);
  }

  exit(nextState: SimpleState): void {
    console.log(this.constructor.name, 'exit', nextState);
  }

  validate(timeElapsed: number, input: StateInput): void {
    console.log(this.constructor.name, 'validate', timeElapsed, input);
  }

}

IdleUser.name;
