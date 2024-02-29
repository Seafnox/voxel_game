import { Vector3, Mesh } from 'three';
import { ModelUnitShape } from './ModelUnitShape';

export interface BaseModelUnitConfig {
  shape: ModelUnitShape;
  color: string;
  offset?: Vector3;
}

export type ModelUnitBuilder<T extends BaseModelUnitConfig> = (config: T) => Mesh;
