import { GameEngine } from 'src/engine/GameEngine';
import { System, SystemConstructor } from 'src/engine/System';
import { FilterPredicate } from './FilterPredicate';

export class SystemManager {
  private systemMap: Record<string, System> = {};
  private systemList: System[] = [];
  private idCounter = 0;

  constructor(
    private gameEngine: GameEngine,
  ) {}

  get(name: string): System {
    if (!this.systemMap[name]) {
      throw new Error(`Can't find ${System.name} '${name}' in ${this.constructor.name} '${SystemManager.name}'`);
    }

    return this.systemMap[name];
  }

  find<TSystem extends System>(constructor: SystemConstructor<TSystem>): TSystem {
    const first = this.systemMap[constructor.name];

    if (!first) {
      throw new Error(`Can't find ${constructor.name} in ${this.constructor.name}`);
    }

    return first as TSystem;
  }

  filter(predicate: FilterPredicate<System>): System[] {
    return this.systemList.filter(predicate);
  }

  create<TSystem extends System>(constructor: SystemConstructor<TSystem>): TSystem {
    const name = constructor.name;
    const system = new constructor(this.gameEngine, name);
    console.log(this.constructor.name, 'create', constructor.name);

    this.systemMap[name] = system;
    this.systemList.push(system);

    return system;
  }

  activate(system: System) {
    console.log(this.constructor.name, 'activate', system.constructor.name, system.name);
    system.isActive = true;
  }

  disactivate(system: System) {
    console.log(this.constructor.name, 'disactivate', system.constructor.name, system.name);
    system.isActive = false;
  }

  private generateName(prefix: string) {
    this.idCounter += 1;

    return `${prefix}__${this.idCounter}`;
  }
}
