import { StateMachineEvent } from 'src/entity/state/StateMachineEvent';
import { Entity } from '../../engine/Entity';
import { getVisualEntityOrThrow } from '../utils/getVisualEntityOrThrow';
import { StateInput } from './StateInput';
import { SimpleState, SimpleStateConstructor } from './SimpleState';

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
    const entity = getVisualEntityOrThrow(this, this.entity);

    if (!this.states[constructor.name]) {
      console.log(this.states);
      throw new Error(`Can't find state '${constructor.name}' in ${Object.keys(this.states).join(', ')}`);
    }

    const lastState = this.currentState;
    const newState = new this.states[constructor.name](this, entity);

    if (lastState) {
      if (lastState.constructor.name == constructor.name) {
        return;
      }
      lastState.exit(newState);
    }

    this.currentState = newState;
    newState.enter(lastState);

    this.entity?.broadcast(StateMachineEvent.PlayerAction, {
      action: this.currentState.constructor.name,
      time: this.currentState.action?.time || 0,
    });
  }

  // FIXME create state controller with state validation process
  validateState(deltaTime: number, input: StateInput) {
    if (this.currentState) {
      this.currentState.validate(deltaTime, input);

      this.entity?.broadcast(StateMachineEvent.PlayerAction, {
        action: this.currentState.constructor.name,
        time: this.currentState.action?.time || 0,
      });
    }
  }
}
