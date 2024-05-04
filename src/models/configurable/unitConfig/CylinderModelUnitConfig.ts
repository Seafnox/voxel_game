import { Mesh, MeshStandardMaterial, CylinderGeometry } from 'three';
import { BaseModelUnitConfig, ModelUnitBuilder, baseModelUnitBuilder } from './BaseModelUnitConfig';
import { ModelUnitShape } from '../ModelUnitShape';

export interface CylinderModelUnitConfig extends BaseModelUnitConfig {
  shape: ModelUnitShape.Cylinder;
  radius: number;
  height: number;
}

export const cylinderModelUnitBuilder: ModelUnitBuilder<CylinderModelUnitConfig> = (config) => {
  const geometry = new CylinderGeometry(config.radius, config.radius, config.height);
  // FIXME Fix Color parsing from json
  const mesh = new Mesh(geometry, new MeshStandardMaterial({color: config.color}));

  return baseModelUnitBuilder(mesh, config);
};
