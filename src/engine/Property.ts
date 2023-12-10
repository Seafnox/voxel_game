import { Entity } from 'src/engine/Entity';
import { UpdatePropertyEvent } from 'src/engine/UpdatePropertyEvent';

export interface PropertyConstructor<TValue, TProperty extends Property<TValue>> {
  new(entity: Entity, value: TValue): TProperty
}

export class Property<TValue> {
  constructor(
    protected entity: Entity,
    protected value: TValue,
  ) {
    this.entity.emit<UpdatePropertyEvent<TValue>>(this.constructor.name, {
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

    this.entity.emit<UpdatePropertyEvent<TValue>>(this.constructor.name, {
      prev,
      next: value,
    });

  }
}
