import { Vector3, CylinderGeometry, Mesh, MeshStandardMaterial } from 'three';
import { BaseModelUnitConfig, ModelUnitBuilder } from './BaseModelUnitConfig';
import { ModelUnitShape } from '../ModelUnitShape';

export interface ConeModelUnitConfig extends BaseModelUnitConfig {
  shape: ModelUnitShape.Cone;
  radiusTop: number;
  radiusBottom: number;
  height: number;
  offset?: Vector3;
}

export const coneModelUnitBuilder: ModelUnitBuilder<ConeModelUnitConfig> = (config) => {
  const geometry = new CylinderGeometry(config.radiusTop, config.radiusBottom, config.height);
  const mesh = new Mesh(geometry, new MeshStandardMaterial({color: config.color}));

  mesh.castShadow = true;
  mesh.receiveShadow = true;

  if (config.offset) {
    mesh.position.set(config.offset.x, config.offset.y, config.offset.z);
  }

  return mesh;
};
