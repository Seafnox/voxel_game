import { GameEngine } from 'src/engine/GameEngine';
import { System, SystemConstructor } from 'src/engine/System';
import { FilterPredicate } from './FilterPredicate';

export class SystemManager {
  private systems: Record<string, System> = {};
  private idCounter = 0;

  constructor(
    private gameEngine: GameEngine,
  ) {}

  get<TSystem extends System>(name: string): TSystem {
    if (!this.systems[name]) {
      throw new Error(`Can't find ${System.name} '${name}' in ${this.constructor.name} '${SystemManager.name}'`);
    }

    return this.systems[name] as TSystem;
  }

  find<TSystem extends System>(constructor: SystemConstructor<System>): TSystem[] {
    return Object.values(this.systems).filter(system => system instanceof constructor) as TSystem[];
  }

  findOne<TSystem extends System>(constructor: SystemConstructor<System>): TSystem {
    const systems = this.find<TSystem>(constructor);
    const first = systems[0];

    if (!first) {
      throw new Error(`Can't find ${constructor.name} in ${this.constructor.name} '${SystemManager.name}'`);
    }

    return first;
  }

  filter(predicate: FilterPredicate<System>): System[] {
    return Object.values(this.systems).filter(predicate);
  }

  create<TSystem extends System>(constructor: SystemConstructor<TSystem>, preferName?: string): TSystem {
    // FIXME is system in engine is unique? i think so. should use only constructor name?
    const name = preferName || this.generateName(constructor.name);
    const system = new constructor(this.gameEngine, name);
    console.log(this.constructor.name, 'create', constructor.name, name);

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
