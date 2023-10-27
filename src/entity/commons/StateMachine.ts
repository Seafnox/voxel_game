import {Entity} from "./Entity";
import {AnimationAction} from "three";

export interface StateInput {

}

export interface SimpleStateConstructor {
  // eslint-disable-next-line @typescript-eslint/no-misused-new
  new (controller: StateMachine, entity: Entity): SimpleState;
}
export interface SimpleState {
  availableNext: SimpleState[] | undefined;
  action: AnimationAction | undefined;
  exit(nextState: SimpleState): void;
  enter(prevState: SimpleState | undefined): void;
  validate(deltaTime: number, input: StateInput): void;
}

export class StateMachine {
  private states: Record<string, SimpleStateConstructor> = {};
  private entity: Entity | undefined;
  currentState: SimpleState | undefined;
  currentStateName: string | undefined;

  setEntity(entity: Entity) {
    this.entity = entity;
  }

  addState(constructor: SimpleStateConstructor) {
    this.states[constructor.name] = constructor;
  }

  setState(name: string) {
    if (!this.entity) {
      console.log(this);
      throw new Error(`Can't find entity in ${this.constructor.name}`);
    }

    if (!this.states[name]) {
      console.log(this.states);
      throw new Error(`Can't find state '${name}' in ${Object.keys(this.states).join(', ')}`);
    }

    const prevState = this.currentState;
    const newState = new this.states[name](this, this.entity);

    if (prevState) {
      if (prevState.constructor.name == name) {
        return;
      }
      prevState.exit(newState);
    }

    this.currentState = newState;
    this.currentStateName = newState.constructor.name;
    newState.enter(prevState);
  }

  validateState(deltaTime: number, input: StateInput) {
    if (this.currentState) {
      this.currentState.validate(deltaTime, input);

      this.entity?.broadcast({
        topic: 'player.action',
        value: {
          action: this.currentState.constructor.name,
          time: this.currentState.action?.time || 0,
        },
      });
    }
  }
}
