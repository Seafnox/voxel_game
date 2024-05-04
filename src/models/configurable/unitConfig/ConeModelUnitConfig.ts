import { CylinderGeometry, Mesh, MeshStandardMaterial } from 'three';
import { BaseModelUnitConfig, ModelUnitBuilder, baseModelUnitBuilder } from './BaseModelUnitConfig';
import { ModelUnitShape } from '../ModelUnitShape';

export interface ConeModelUnitConfig extends BaseModelUnitConfig {
  shape: ModelUnitShape.Cone;
  radiusTop: number;
  radiusBottom: number;
  height: number;
}

export const coneModelUnitBuilder: ModelUnitBuilder<ConeModelUnitConfig> = (config) => {
  const geometry = new CylinderGeometry(config.radiusTop, config.radiusBottom, config.height);
  const mesh = new Mesh(geometry, new MeshStandardMaterial({color: config.color}));

  return baseModelUnitBuilder(mesh, config);
};
