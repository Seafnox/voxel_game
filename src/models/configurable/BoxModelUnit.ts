import { Vector3, BoxGeometry, Mesh, MeshBasicMaterial } from 'three';
import { BaseModelUnitConfig, ModelUnitBuilder } from './BaseModelUnitConfig';
import { ModelUnitShape } from './ModelUnitShape';

export interface BoxModelUnit extends BaseModelUnitConfig {
  shape: ModelUnitShape.Box;
  size: Vector3;
  offset?: Vector3;
}

export const boxModelUnitBuilder: ModelUnitBuilder<BoxModelUnit> = (config) => {
  const geometry = new BoxGeometry(config.size.x, config.size.y, config.size.z);
  const mesh = new Mesh(geometry, new MeshBasicMaterial({color: config.color}));

  mesh.castShadow = false;
  mesh.receiveShadow = true;

  if (config.offset) {
    mesh.position.set(config.offset.x, config.offset.y, config.offset.z);
  }

  return mesh;
};
