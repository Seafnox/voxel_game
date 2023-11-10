import { Entity } from './Entity';

export class EntityManager {
  private idCounter = 0;
  entities: Record<string, Entity> = {};
  activeEntities: Entity[] = [];

  generateName() {
    this.idCounter += 1;

    return '__name__' + this.idCounter;
  }

  get<TEntity extends Entity>(name: string): TEntity | undefined {
    return this.entities[name] as TEntity;
  }

  add(entity: Entity, preferName?: string) {
    const name = preferName || this.generateName();
    console.log(this.constructor.name, 'add', entity.constructor.name, name);
    this.entities[name] = entity;

    entity.entityManager = this;
    entity.name = name;
  }

  activate(entity: Entity) {
    console.log(this.constructor.name, 'activate', entity.constructor.name, entity.name);
    const i = this.activeEntities.indexOf(entity);
    if (i >= 0) {
      return;
    }

    this.activeEntities.push(entity);
  }

  disactivate(entity: Entity) {
    console.log(this.constructor.name, 'disactivate', entity.constructor.name, entity.name);
    const i = this.activeEntities.indexOf(entity);
    if (i < 0) {
      return;
    }

    this.activeEntities.splice(i, 1);
  }

  update(deltaTime: number) {
    for (const e of this.activeEntities) {
      e.update(deltaTime);
    }
  }
}
