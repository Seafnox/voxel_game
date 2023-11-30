import { GameEngine } from 'src/engine/GameEngine';
import { EventSystem, EventSystemConstructor } from 'src/engine/EventSystem';
import { FilterPredicate } from './FilterPredicate';

export class SystemManager {
  private systemMap: Record<string, EventSystem> = {};
  private systemList: EventSystem[] = [];
  private idCounter = 0;

  constructor(
    private gameEngine: GameEngine,
  ) {}

  get(name: string): EventSystem {
    if (!this.systemMap[name]) {
      throw new Error(`Can't find ${EventSystem.name} '${name}' in ${this.constructor.name} '${SystemManager.name}'`);
    }

    return this.systemMap[name];
  }

  find<TSystem extends EventSystem>(constructor: EventSystemConstructor<TSystem>): TSystem {
    const first = this.systemMap[constructor.name];

    if (!first) {
      throw new Error(`Can't find ${constructor.name} in ${this.constructor.name}`);
    }

    return first as TSystem;
  }

  filter(predicate: FilterPredicate<EventSystem>): EventSystem[] {
    return this.systemList.filter(predicate);
  }

  create<TSystem extends EventSystem>(constructor: EventSystemConstructor<TSystem>): TSystem {
    const name = constructor.name;
    const system = new constructor(this.gameEngine, name);
    console.log(this.constructor.name, 'create', constructor.name);

    this.systemMap[name] = system;
    this.systemList.push(system);

    return system;
  }

  private generateName(prefix: string) {
    this.idCounter += 1;

    return `${prefix}__${this.idCounter}`;
  }
}
