import { Vector3, Mesh, MeshStandardMaterial, CylinderGeometry } from 'three';
import { BaseModelUnitConfig, ModelUnitBuilder } from './BaseModelUnitConfig';
import { ModelUnitShape } from '../ModelUnitShape';

export interface CylinderModelUnitConfig extends BaseModelUnitConfig {
  shape: ModelUnitShape.Cylinder;
  radius: number;
  height: number;
  offset?: Vector3;
}

export const cylinderModelUnitBuilder: ModelUnitBuilder<CylinderModelUnitConfig> = (config) => {
  const geometry = new CylinderGeometry(config.radius, config.radius, config.height);
  const mesh = new Mesh(geometry, new MeshStandardMaterial({color: config.color}));

  mesh.castShadow = true;
  mesh.receiveShadow = true;

  if (config.offset) {
    mesh.position.set(config.offset.x, config.offset.y, config.offset.z);
  }

  return mesh;
};
