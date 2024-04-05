import { Vector3, SphereGeometry, MeshStandardMaterial, Mesh } from 'three';
import { BaseModelUnitConfig, ModelUnitBuilder } from './BaseModelUnitConfig';
import { ModelUnitShape } from '../ModelUnitShape';

export interface SphereModelUnitConfig extends BaseModelUnitConfig {
  shape: ModelUnitShape.Sphere;
  radius: number;
  offset?: Vector3;
}

export const sphereModelUnitBuilder: ModelUnitBuilder<SphereModelUnitConfig> = (config) => {
  const geometry = new SphereGeometry(config.radius);
  const mesh = new Mesh(geometry, new MeshStandardMaterial({color: config.color}));

  mesh.castShadow = false;
  mesh.receiveShadow = true;

  if (config.offset) {
    mesh.position.set(config.offset.x, config.offset.y, config.offset.z);
  }

  return mesh;
};
