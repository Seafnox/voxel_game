import { Entity } from 'src/engine/Entity';
import { Property, PropertyConstructor } from 'src/engine/Property';

export class PropertyManager {
  private _properties: Record<string, Property<unknown>> = {};

  constructor(
    private entity: Entity,
  ) {}

  private get constructorName(): string {
    return this.entity.constructor.name;
  }

  private get name(): string {
    return this.entity.name;
  }

  register<TValue, TProperty extends Property<TValue>>(constructor: PropertyConstructor<TValue, TProperty>, value: TValue) {
    const propertyName = constructor.name;

    if (propertyName in this._properties) {
      throw new Error(`Property '${propertyName}' already registered in ${this.constructorName} '${this.name}'`)
    }

    this._properties[propertyName] = new constructor(this.entity, value);
  }

  has<TValue, TProperty extends Property<TValue>>(constructor: PropertyConstructor<TValue, TProperty>): boolean {
    return constructor.name in this._properties;
  }

  find<TValue, TProperty extends Property<TValue>>(constructor: PropertyConstructor<TValue, TProperty>): TProperty {
    const propertyName = constructor.name;

    if (!(propertyName in this._properties)) {
      throw new Error(`Can't read property '${propertyName}' from ${this.constructorName} '${this.name}'`)
    }

    return this._properties[propertyName] as TProperty;
  }

}
