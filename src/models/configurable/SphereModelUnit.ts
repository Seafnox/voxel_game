import { Vector3, SphereGeometry, MeshBasicMaterial, Mesh } from 'three';
import { BaseModelUnitConfig, ModelUnitBuilder } from './BaseModelUnitConfig';
import { ModelUnitShape } from './ModelUnitShape';

export interface SphereModelUnit extends BaseModelUnitConfig {
  shape: ModelUnitShape.Sphere;
  radius: number;
  offset?: Vector3;
}

export const sphereModelUnitBuilder: ModelUnitBuilder<SphereModelUnit> = (config) => {
  const geometry = new SphereGeometry(config.radius);
  const mesh = new Mesh(geometry, new MeshBasicMaterial({ color: config.color }));

  mesh.castShadow = false;
  mesh.receiveShadow = true;

  if (config.offset) {
    mesh.position.set(config.offset.x, config.offset.y, config.offset.z);
  }

  return mesh;
}
