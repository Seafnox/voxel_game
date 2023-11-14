import { Entity, EntityConstructor } from './Entity';

export class GameEngine {
  private idCounter = 0;
  private entities: Record<string, Entity> = {};
  private activeEntities: Entity[] = [];
  // TODO make systems with events

  // TODO make segments for engine. Like Surface, Gravity

  // TODo split controllers to components and actions. Combine Actions with engine Segments and Systems

  constructor(
    private name: string,
  ) {}

  get<TEntity extends Entity>(name: string): TEntity {
    if (!this.entities[name]) {
      throw new Error(`Can't find ${Entity.name} '${name}' in ${this.constructor.name} '${this.name}'`);
    }

    return this.entities[name] as TEntity;
  }

  find<TEntity extends Entity>(constructor: EntityConstructor<Entity>): TEntity[] {
    return Object.values(this.entities).filter(entity => entity instanceof constructor) as TEntity[];
  }

  findOne<TEntity extends Entity>(constructor: EntityConstructor<Entity>): TEntity {
    const entities = this.find<TEntity>(constructor);
    const first = entities[0];

    if (!first) {
      throw new Error(`Can't find ${constructor.name} in ${this.constructor.name} '${this.name}'`);
    }

    return first;
  }

  create<TEntity extends Entity>(constructor: EntityConstructor<TEntity>, preferName?: string): TEntity {
    const name = preferName || this.generateName(constructor.name);
    const entity = new constructor(this, name);
    console.log(this.constructor.name, 'create', constructor.name, name);

    this.entities[name] = entity

    return entity;
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
    this.activeEntities.forEach(entity => entity.update(deltaTime));
  }

  private generateName(prefix: string) {
    this.idCounter += 1;

    return `${prefix}__${this.idCounter}`;
  }
}
