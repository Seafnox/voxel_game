import { GameEngine } from 'src/engine/GameEngine';
import { System, SystemConstructor } from 'src/engine/System';
import { FilterPredicate } from './FilterPredicate';

export class SystemManager {
  private systems: Record<string, System> = {};
  private idCounter = 0;

  constructor(
    private gameEngine: GameEngine,
  ) {}

  get(name: string): System {
    if (!this.systems[name]) {
      throw new Error(`Can't find ${System.name} '${name}' in ${this.constructor.name} '${SystemManager.name}'`);
    }

    return this.systems[name];
  }

  find<TSystem extends System>(constructor: SystemConstructor<TSystem>): TSystem {
    const first = this.systems[constructor.name];

    if (!first) {
      throw new Error(`Can't find ${constructor.name} in ${this.constructor.name}`);
    }

    return first as TSystem;
  }

  filter(predicate: FilterPredicate<System>): System[] {
    return Object.values(this.systems).filter(predicate);
  }

  create<TSystem extends System>(constructor: SystemConstructor<TSystem>): TSystem {
    const name = constructor.name;
    const system = new constructor(this.gameEngine, name);
    console.log(this.constructor.name, 'create', constructor.name);

    this.systems[name] = system

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
