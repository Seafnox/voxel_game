import { Vector3, CylinderGeometry, Mesh, MeshBasicMaterial } from 'three';
import { BaseModelUnitConfig, ModelUnitBuilder } from './BaseModelUnitConfig';
import { ModelUnitShape } from './ModelUnitShape';

export interface CylinderModelUnit extends BaseModelUnitConfig {
  shape: ModelUnitShape.Cylinder;
  radiusTop: number;
  radiusBottom: number;
  height: number;
  offset?: Vector3;
}

export const cylinderModelUnitBuilder: ModelUnitBuilder<CylinderModelUnit> = (config) => {
  const geometry = new CylinderGeometry(config.radiusTop, config.radiusBottom, config.height);
  const mesh = new Mesh(geometry, new MeshBasicMaterial({color: config.color}));

  mesh.castShadow = false;
  mesh.receiveShadow = true;

  if (config.offset) {
    mesh.position.set(config.offset.x, config.offset.y, config.offset.z);
  }

  return mesh;
};
