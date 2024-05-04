import { SphereGeometry, MeshStandardMaterial, Mesh } from 'three';
import { BaseModelUnitConfig, ModelUnitBuilder, baseModelUnitBuilder } from './BaseModelUnitConfig';
import { ModelUnitShape } from '../ModelUnitShape';

export interface SphereModelUnitConfig extends BaseModelUnitConfig {
  shape: ModelUnitShape.Sphere;
  radius: number;
}

export const sphereModelUnitBuilder: ModelUnitBuilder<SphereModelUnitConfig> = (config) => {
  const geometry = new SphereGeometry(config.radius);
  const mesh = new Mesh(geometry, new MeshStandardMaterial({color: config.color}));

  return baseModelUnitBuilder(mesh, config);
};
