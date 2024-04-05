import { Vector3, BoxGeometry, Mesh, MeshStandardMaterial } from 'three';
import { BaseModelUnitConfig, ModelUnitBuilder } from './BaseModelUnitConfig';
import { ModelUnitShape } from '../ModelUnitShape';

export interface BoxModelUnitConfig extends BaseModelUnitConfig {
  shape: ModelUnitShape.Box;
  size: Vector3;
  offset?: Vector3;
}

export const boxModelUnitBuilder: ModelUnitBuilder<BoxModelUnitConfig> = (config) => {
  const geometry = new BoxGeometry(config.size.x, config.size.y, config.size.z);
  const mesh = new Mesh(geometry, new MeshStandardMaterial({color: config.color}));

  mesh.castShadow = true;
  mesh.receiveShadow = true;

  if (config.offset) {
    mesh.position.set(config.offset.x, config.offset.y, config.offset.z);
  }

  return mesh;
};
