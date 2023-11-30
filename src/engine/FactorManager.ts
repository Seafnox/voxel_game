import { FilterPredicate } from './FilterPredicate';
import { Factor, FactorConstructor } from './Factor';

export class FactorManager {
  private factorMap: Record<string, Factor> = {};
  private factorList: Factor[] = [];

  get<TFactor extends Factor>(name: string): TFactor {
    if (!this.factorMap[name]) {
      throw new Error(`Can't find Factor '${name}' in ${this.constructor.name} '${FactorManager.name}'`);
    }

    return this.factorMap[name] as TFactor;
  }

  find<TFactor extends Factor>(constructor: FactorConstructor<TFactor>): TFactor {
    const first = this.factorMap[constructor.name];

    if (!first) {
      throw new Error(`Can't find ${constructor.name} in ${this.constructor.name} '${FactorManager.name}'`);
    }

    return first as TFactor;
  }

  filter(predicate: FilterPredicate<Factor>): Factor[] {
    return this.factorList.filter(predicate);
  }

  create<TFactor extends Factor>(constructor: FactorConstructor<TFactor>): TFactor {
    const name = constructor.name;
    const factor = new constructor();
    console.log(this.constructor.name, 'create', constructor.name, name);

    this.factorMap[name] = factor;
    this.factorList.push(factor);

    return factor;
  }

}
