import { Entity } from './Entity';

export interface Controller {
  entity: Entity | undefined;
  // FIXME turn into setter with onChange hook oldEntity, newEntity
  onEntityChange?(): void;
  update(deltaTime: number): void;
}
