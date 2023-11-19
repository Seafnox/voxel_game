import { FilterPredicate } from './FilterPredicate';
import { Factor, FactorConstructor } from './Factor';

export class FactorManager {
  private factorMap: Record<string, Factor<unknown>> = {};
  private factorList: Factor<unknown>[] = [];

  get<TValue, TFactor extends Factor<TValue>>(name: string): TFactor {
    if (!this.factorMap[name]) {
      throw new Error(`Can't find Factor '${name}' in ${this.constructor.name} '${FactorManager.name}'`);
    }

    return this.factorMap[name] as TFactor;
  }

  find<TValue, TFactor extends Factor<TValue>>(constructor: FactorConstructor<TValue, TFactor>): TFactor {
    const first = this.factorMap[constructor.name];

    if (!first) {
      throw new Error(`Can't find ${constructor.name} in ${this.constructor.name} '${FactorManager.name}'`);
    }

    return first as TFactor;
  }

  filter(predicate: FilterPredicate<Factor<unknown>>): Factor<unknown>[] {
    return this.factorList.filter(predicate);
  }

  create<TValue, TFactor extends Factor<TValue>>(constructor: FactorConstructor<TValue, TFactor>): TFactor {
    const name = constructor.name;
    const factor = new constructor();
    console.log(this.constructor.name, 'create', constructor.name, name);

    this.factorMap[name] = factor;
    this.factorList.push(factor);

    return factor;
  }

}
