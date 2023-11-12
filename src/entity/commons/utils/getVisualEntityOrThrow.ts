import { Entity } from '../Entity';
import { VisualEntity } from '../VisualEntity';

export function getVisualEntityOrThrow<
  TAny extends NonNullable<unknown>,
  TEntity extends Entity
>(self: TAny, entity?: TEntity): TEntity & VisualEntity {
  if (!entity) {
    throw new Error(`Can't find parent entity for ${self.constructor.name}`);
  }

  if (!(entity instanceof VisualEntity)) {
    throw new Error(`Can't mace calculation for 3d Object in simple Entity. Use ${VisualEntity.name}`);
  }

  return entity;
}
