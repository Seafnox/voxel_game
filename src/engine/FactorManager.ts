import { FilterPredicate } from './FilterPredicate';
import { Factor, FactorConstructor } from './Factor';

export class FactorManager {
  private factors: Record<string, Factor<unknown>> = {};

  get<TValue, TFactor extends Factor<TValue>>(name: string): TFactor {
    if (!this.factors[name]) {
      throw new Error(`Can't find Factor '${name}' in ${this.constructor.name} '${FactorManager.name}'`);
    }

    return this.factors[name] as TFactor;
  }

  find<TValue, TFactor extends Factor<TValue>>(constructor: FactorConstructor<TValue, TFactor>): TFactor[] {
    return Object.values(this.factors).filter(factor => factor instanceof constructor) as TFactor[];
  }

  findOne<TValue, TFactor extends Factor<TValue>>(constructor: FactorConstructor<TValue, TFactor>): TFactor {
    const factors = this.find<TValue, TFactor>(constructor);
    const first = factors[0];

    if (!first) {
      throw new Error(`Can't find ${constructor.name} in ${this.constructor.name} '${FactorManager.name}'`);
    }

    return first;
  }

  filter(predicate: FilterPredicate<Factor<unknown>>): Factor<unknown>[] {
    return Object.values(this.factors).filter(predicate);
  }

  create<TValue, TFactor extends Factor<TValue>>(constructor: FactorConstructor<TValue, TFactor>): TFactor {
    const name = constructor.name;
    const factor = new constructor();
    console.log(this.constructor.name, 'create', constructor.name, name);

    this.factors[name] = factor;

    return factor;
  }

}
