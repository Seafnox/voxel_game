import { Mesh } from 'three';
import { ModelUnitShape } from '../ModelUnitShape';

export interface BaseModelUnitConfig {
  shape: ModelUnitShape;
  color: string | number;
  offset?: number[];
}

export type ModelUnitBuilder<T extends BaseModelUnitConfig> = (config: T) => Mesh;

export function baseModelUnitBuilder<T extends Mesh>(mesh: T, config: BaseModelUnitConfig): T {
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  if (config.offset) {
    mesh.position.set(config.offset[0], config.offset[1], config.offset[2]);
  }

  return mesh;
}
