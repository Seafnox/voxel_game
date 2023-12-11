import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { ActiveStateProperty } from 'src/state/ActiveStateProperty';
import { SimpleStateConstructor, SimpleState } from 'src/state/SimpleState';
import { NoopState } from 'src/state/NoopState';
import { TickSystem, TickSystemEvent } from 'src/browser/TickSystem';

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

    this.entity.properties.register(ActiveStateProperty, this.defaultState);

    this.engine.systems.find(TickSystem).on(TickSystemEvent.Tick, this.validateState.bind(this));
  }

  get activeState(): ActiveStateProperty {
    return this.entity.properties.find(ActiveStateProperty);
  }

  addState(constructor: SimpleStateConstructor) {
    this.states[constructor.name] = constructor;
  }

  setState(constructor: SimpleStateConstructor) {
    if (!this.states[constructor.name]) {
      console.log(this.states);
      throw new Error(`Can't find state '${constructor.name}' in ${Object.keys(this.states).join(', ')}`);
    }

    const lastState = this.activeState.get();
    const newState = new this.states[constructor.name](this.engine, this.entity, this);

    if (lastState) {
      if (lastState.constructor.name == constructor.name) {
        return;
      }
      lastState.exit(newState);
    }

    newState.enter(lastState);
    this.activeState.set(newState);
  }

  validateState(deltaTime: number) {
    this.activeState.get().validate(deltaTime);
  }
}
