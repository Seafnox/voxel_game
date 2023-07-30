import { Entity } from './Entity';

export type FilterPredicate<TValue, SValue extends TValue> = (value: TValue, index: number, array: TValue[]) => value is SValue;

export class EntityManager {
  private idCounter = 0;
  entities: Record<string, Entity> = {};
  activeEntities: Entity[] = [];

  generateName() {
    this.idCounter += 1;

    return '__name__' + this.idCounter;
  }

  get(name: string) {
    return this.entities[name];
  }

  filter<TEntity extends Entity>(predicate: FilterPredicate<Entity, TEntity>): TEntity[] {
    return this.activeEntities.filter(predicate);
  }

  add(entity: Entity, preferName?: string) {
    const name = preferName || this.generateName();
    this.entities[name] = entity;
    this.activeEntities.push(entity);

    entity.entityManager = this;
    entity.name = name;
  }

  disactivate(entity: Entity) {
    const i = this.activeEntities.indexOf(entity);
    if (i < 0) {
      return;
    }

    this.activeEntities.splice(i, 1);
  }

  update(timeElapsed: number) {
    for (const e of this.activeEntities) {
      e.update(timeElapsed);
    }
  }
}