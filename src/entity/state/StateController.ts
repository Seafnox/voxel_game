import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { ActiveStateProperty } from 'src/entity/properties/state';
import { SimpleStateConstructor, SimpleState } from 'src/entity/state/SimpleState';
import { NoopState } from 'src/entity/state/NoopState';
import { TickSystem, TickSystemEvent } from 'src/system/TickSystem';

export class StateController extends Controller {
  private states: Record<string, SimpleStateConstructor> = {};
  defaultState: SimpleState;

  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

    this.defaultState = new NoopState(engine, entity, this);

    this.entity.registerProperty(ActiveStateProperty, this.defaultState);

    this.engine.systems.find(TickSystem).on(TickSystemEvent.Tick, this.validateState.bind(this));
  }

  get activeState(): SimpleState {
    return this.entity.getProperty<SimpleState>(ActiveStateProperty);
  }

  addState(constructor: SimpleStateConstructor) {
    this.states[constructor.name] = constructor;
  }

  setState(constructor: SimpleStateConstructor) {
    if (!this.states[constructor.name]) {
      console.log(this.states);
      throw new Error(`Can't find state '${constructor.name}' in ${Object.keys(this.states).join(', ')}`);
    }

    const lastState = this.activeState;
    const newState = new this.states[constructor.name](this.engine, this.entity, this);

    if (lastState) {
      if (lastState.constructor.name == constructor.name) {
        return;
      }
      lastState.exit(newState);
    }

    newState.enter(lastState);
    this.entity.setProperty(ActiveStateProperty, newState);
  }

  validateState(deltaTime: number) {
    this.activeState.validate(deltaTime);
  }
}
