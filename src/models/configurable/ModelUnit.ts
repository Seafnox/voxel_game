import { Mesh } from 'three';
import { BaseModelUnitConfig, ModelUnitBuilder } from './BaseModelUnitConfig';
import { boxModelUnitBuilder } from './BoxModelUnit';
import { coneModelUnitBuilder } from './ConeModelUnit';
import { cylinderModelUnitBuilder } from './CylinderModelUnit';
import { ModelUnitShape } from './ModelUnitShape';
import { sphereModelUnitBuilder } from './SphereModelUnit';

export class ModelUnit {
  private static map: Record<ModelUnitShape, ModelUnitBuilder<never>> = {
    [ModelUnitShape.Box]: boxModelUnitBuilder,
    [ModelUnitShape.Cone]: coneModelUnitBuilder,
    [ModelUnitShape.Sphere]: sphereModelUnitBuilder,
    [ModelUnitShape.Cylinder]: cylinderModelUnitBuilder,
  };

  static build<T extends BaseModelUnitConfig>(config: T): Mesh {
    if (!this.map[config.shape]) {
      throw new Error(`Invalid model unit shape: ${config.shape}`);
    }

    return this.map[config.shape](config as never);
  }
}
