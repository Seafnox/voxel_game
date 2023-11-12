import { System } from './System';

export class SystemManager {
  private idCounter = 0;
  private systems: Record<string, System> = {}

    get<TEntity extends System>(name: string): TEntity | undefined {
    return this.systems[name] as TEntity;
  }

  add(system: System) {
    const name = this.generateName(system.constructor.name);
    console.log(this.constructor.name, 'add', system.constructor.name, name);
    this.systems[name] = system;

    system.systemManager = this;
    system.name = name;
  }

  activate(system: System) {
    console.log(this.constructor.name, 'activate', system.constructor.name, system.name);
    system.setActive(true);
  }

  disactivate(system: System) {
    console.log(this.constructor.name, 'disactivate', system.constructor.name, system.name);
    system.setActive(false);
  }

  private generateName(prefix: string) {
    this.idCounter += 1;

    return `${prefix}__${this.idCounter}`;
  }

}
