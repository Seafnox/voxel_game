import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { SimpleStateConstructor, SimpleState } from 'src/entity/state/SimpleState';
import { NoopState } from 'src/entity/state/NoopState';
import { VisualEntity } from 'src/entity/visualEntity/VisualEntity';
import { TickSystem, TickSystemEvent } from 'src/system/TickSystem';

export const ActiveStateProperty = 'activeState';

export class StateController extends Controller<VisualEntity> {
  private states: Record<string, SimpleStateConstructor> = {};
  defaultState: SimpleState;

  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    if (!(entity instanceof VisualEntity)) {
      throw new Error(`Can't make calculation for 3d Object in simple Entity. Use ${VisualEntity.name}`);
    }

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
