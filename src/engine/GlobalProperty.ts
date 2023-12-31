import { GameEngine } from 'src/engine/GameEngine';
import { UpdatePropertyEvent } from 'src/engine/UpdatePropertyEvent';

export interface GlobalPropertyConstructor<TValue, TProperty extends GlobalProperty<TValue>> {
  new(engine: GameEngine, value?: TValue): TProperty
}

export class GlobalProperty<TValue> {
  constructor(
    protected engine: GameEngine,
    protected value: TValue,
  ) {
    this.engine.emit<UpdatePropertyEvent<TValue>>(this.constructor.name, {
      prev: undefined,
      next: this.value,
    });
  }

  get(): TValue {
    return this.value;
  }
  set(value: TValue): void {
    const prev = this.value;
    this.value = value;

    this.engine.emit<UpdatePropertyEvent<TValue>>(this.constructor.name, {
      prev,
      next: value,
    });

  }
}
