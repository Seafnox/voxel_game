import { Vector3, ConeGeometry, Mesh, MeshBasicMaterial } from 'three';
import { BaseModelUnitConfig, ModelUnitBuilder } from './BaseModelUnitConfig';
import { ModelUnitShape } from './ModelUnitShape';

export interface ConeModelUnit extends BaseModelUnitConfig {
  shape: ModelUnitShape.Cone;
  radius: number;
  height: number;
  offset?: Vector3;
}

export const coneModelUnitBuilder: ModelUnitBuilder<ConeModelUnit> = (config) => {
  const geometry = new ConeGeometry(config.radius, config.height);
  const mesh = new Mesh(geometry, new MeshBasicMaterial({color: config.color}));

  mesh.castShadow = false;
  mesh.receiveShadow = true;

  if (config.offset) {
    mesh.position.set(config.offset.x, config.offset.y, config.offset.z);
  }

  return mesh;
};
