import { Entity, EntityConstructor } from 'src/engine/Entity';
import { FilterPredicate } from 'src/engine/FilterPredicate';
import { GameEngine } from 'src/engine/GameEngine';

export class EntityManager {
  private idCounter = 0;
  private entityMap: Record<string, Entity> = {};
  private entityList: Entity[] = [];

  constructor(
    private gameEngine: GameEngine,
  ) {}

  get<TEntity extends Entity>(name: string): TEntity {
    if (!this.entityMap[name]) {
      throw new Error(`Can't find ${Entity.name} '${name}' in ${this.constructor.name} '${EntityManager.name}'`);
    }

    return this.entityMap[name] as TEntity;
  }

  find<TEntity extends Entity>(constructor: EntityConstructor<TEntity>): TEntity[] {
    return this.entityList.filter(entity => entity instanceof constructor) as TEntity[];
  }

  filter(predicate: FilterPredicate<Entity>): Entity[] {
    return this.entityList.filter(predicate);
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

    this.entityMap[name] = entity;
    this.entityList.push(entity);

    return entity;
  }

  private generateName(prefix: string) {
    this.idCounter += 1;

    return `${prefix}__${this.idCounter}`;
  }

}
