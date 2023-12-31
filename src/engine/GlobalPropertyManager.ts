import { GameEngine } from 'src/engine/GameEngine';
import { GlobalProperty, GlobalPropertyConstructor } from 'src/engine/GlobalProperty';

export class GlobalPropertyManager {
  private _properties: Record<string, GlobalProperty<unknown>> = {};

  constructor(
    private engine: GameEngine,
  ) {}

  private get constructorName(): string {
    return this.constructor.name;
  }

  private get name(): string {
    return this.engine.constructor.name;
  }

  register<TValue, TProperty extends GlobalProperty<TValue>>(constructor: GlobalPropertyConstructor<TValue, TProperty>, value?: TValue): TProperty {
    const propertyName = constructor.name;

    if (propertyName in this._properties) {
      throw new Error(`Property '${propertyName}' already registered in ${this.constructorName} '${this.name}'`)
    }

    this._properties[propertyName] = new constructor(this.engine, value);

    return this._properties[propertyName] as TProperty;
  }

  has<TValue, TProperty extends GlobalProperty<TValue>>(constructor: GlobalPropertyConstructor<TValue, TProperty>): boolean {
    return constructor.name in this._properties;
  }

  find<TValue, TProperty extends GlobalProperty<TValue>>(constructor: GlobalPropertyConstructor<TValue, TProperty>): TProperty {
    const propertyName = constructor.name;

    if (!(propertyName in this._properties)) {
      throw new Error(`Can't read property '${propertyName}' from ${this.constructorName} '${this.name}'`)
    }

    return this._properties[propertyName] as TProperty;
  }

}
