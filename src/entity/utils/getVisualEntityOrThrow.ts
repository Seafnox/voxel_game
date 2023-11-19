import { Entity } from '../../engine/Entity';
import { VisualEntity } from 'src/entity/visualEntity/VisualEntity';

export function getVisualEntityOrThrow<
  TAny extends NonNullable<unknown>,
  TEntity extends Entity
>(self: TAny, entity?: TEntity): TEntity & VisualEntity {
  if (!entity) {
    throw new Error(`Can't find entity for ${self.constructor.name}`);
  }

  if (!(entity instanceof VisualEntity)) {
    throw new Error(`Can't make calculation for 3d Object in simple Entity. Use ${VisualEntity.name}`);
  }

  return entity;
}
