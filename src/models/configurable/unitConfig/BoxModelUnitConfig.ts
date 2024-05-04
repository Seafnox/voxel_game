import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three';
import { BaseModelUnitConfig, ModelUnitBuilder, baseModelUnitBuilder } from './BaseModelUnitConfig';
import { ModelUnitShape } from '../ModelUnitShape';

export interface BoxModelUnitConfig extends BaseModelUnitConfig {
  shape: ModelUnitShape.Box;
  size: number[];
}

export const boxModelUnitBuilder: ModelUnitBuilder<BoxModelUnitConfig> = (config) => {
  const geometry = new BoxGeometry(config.size[0], config.size[1], config.size[2]);
 // FIXME Fix Color parsing from json
  const mesh = new Mesh(geometry, new MeshStandardMaterial({color: config.color}));

  return baseModelUnitBuilder(mesh, config);
};
