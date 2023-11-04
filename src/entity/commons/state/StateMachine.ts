import {Entity} from "../Entity";
import {VisualEntity} from "../VisualEntity";
import {StateInput} from "./StateInput";
import {SimpleState, SimpleStateConstructor} from "./SimpleState";

export class StateMachine {
  private states: Record<string, SimpleStateConstructor> = {};
  private entity: Entity | undefined;
  currentState: SimpleState | undefined;

  setEntity(entity: Entity) {
    this.entity = entity;
  }

  addState(constructor: SimpleStateConstructor) {
    this.states[constructor.name] = constructor;
  }

  setState(constructor: SimpleStateConstructor) {
    if (!this.entity) {
      throw new Error(`Can't find entity in ${this.constructor.name}`);
    }

    if (!(this.entity instanceof VisualEntity)) {
      throw new Error(`Can't make calculation for 3d Object in simple Entity. Use ${VisualEntity.name}`);
    }

    if (!this.states[constructor.name]) {
      console.log(this.states);
      throw new Error(`Can't find state '${constructor.name}' in ${Object.keys(this.states).join(', ')}`);
    }

    const lastState = this.currentState;
    const newState = new this.states[constructor.name](this, this.entity);

    if (lastState) {
      if (lastState.constructor.name == constructor.name) {
        return;
      }
      lastState.exit(newState);
    }

    this.currentState = newState;
    newState.enter(lastState);
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
