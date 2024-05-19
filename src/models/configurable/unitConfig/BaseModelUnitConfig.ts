import { Mesh, Box3 } from 'three';
import { ModelUnitShape } from '../ModelUnitShape';

export interface BaseModelUnitConfig {
  shape: ModelUnitShape;
  color: string | number;
  offset?: number[];
  rotation?: number[];
}

export type ModelUnitBuilder<T extends BaseModelUnitConfig> = (config: T) => Mesh;

export function baseModelUnitBuilder<T extends Mesh>(mesh: T, config: BaseModelUnitConfig): T {
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  if (config.offset) {
    const measure = new Box3().setFromObject(mesh);
    const measureSize = [];
    measureSize[0] = measure.max.x - measure.min.x;
    measureSize[1] = measure.max.y - measure.min.y;
    measureSize[2] = measure.max.z - measure.min.z;
    const realOffset = [
      config.offset[0] + measureSize[0] / 2,
      config.offset[1] + measureSize[1] / 2,
      config.offset[2] + measureSize[2] / 2,
    ];
    mesh.position.set(realOffset[0], realOffset[1], realOffset[2]);
  }

  if (config.rotation) {
    mesh.rotation.set(config.rotation[0], config.rotation[1], config.rotation[2]);
  }

  return mesh;
}
