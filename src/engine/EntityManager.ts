import { Entity, EntityConstructor } from 'src/engine/Entity';
import { FilterPredicate } from 'src/engine/FilterPredicate';
import { GameEngine } from 'src/engine/GameEngine';

export class EntityManager {
  private idCounter = 0;
  private entities: Record<string, Entity> = {};

  constructor(
    private gameEngine: GameEngine,
  ) {}

  get<TEntity extends Entity>(name: string): TEntity {
    if (!this.entities[name]) {
      throw new Error(`Can't find ${Entity.name} '${name}' in ${this.constructor.name} '${EntityManager.name}'`);
    }

    return this.entities[name] as TEntity;
  }

  find<TEntity extends Entity>(constructor: EntityConstructor<TEntity>): TEntity[] {
    return Object.values(this.entities).filter(entity => entity instanceof constructor) as TEntity[];
  }

  filter(predicate: FilterPredicate<Entity>): Entity[] {
    return Object.values(this.entities).filter(predicate);
  }

  findOne<TEntity extends Entity>(constructor: EntityConstructor<TEntity>): TEntity {
    const first = this.find<TEntity>(constructor)[0];

    if (!first) {
      throw new Error(`Can't find ${constructor.name} in ${this.constructor.name}`);
    }

    return first;
  }

  create<TEntity extends Entity>(constructor: EntityConstructor<TEntity>, preferName?: string): TEntity {
    const name = preferName || this.generateName(constructor.name);
    const entity = new constructor(this.gameEngine, name);
    console.log(this.constructor.name, 'create', constructor.name, name);

    this.entities[name] = entity

    return entity;
  }

  activate(entity: Entity) {
    console.log(this.constructor.name, 'activate', entity.constructor.name, entity.name);
    entity.isActive = true;
  }

  disactivate(entity: Entity) {
    console.log(this.constructor.name, 'disactivate', entity.constructor.name, entity.name);
    entity.isActive = false;
  }

  private generateName(prefix: string) {
    this.idCounter += 1;

    return `${prefix}__${this.idCounter}`;
  }

}
