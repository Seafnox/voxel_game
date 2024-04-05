import { Mesh } from 'three';
import { ModelUnitBuilder } from './unitConfig/BaseModelUnitConfig';
import { boxModelUnitBuilder } from './unitConfig/BoxModelUnitConfig';
import { cylinderModelUnitBuilder } from './unitConfig/CylinderModelUnitConfig';
import { CustomModelUnitConfig } from './unitConfig/CustomModelUnitConfig';
import { coneModelUnitBuilder } from './unitConfig/ConeModelUnitConfig';
import { ModelUnitShape } from './ModelUnitShape';
import { sphereModelUnitBuilder } from './unitConfig/SphereModelUnitConfig';

export class ModelUnit {
  private static map: Record<ModelUnitShape, ModelUnitBuilder<never>> = {
    [ModelUnitShape.Box]: boxModelUnitBuilder,
    [ModelUnitShape.Cyllinder]: cylinderModelUnitBuilder,
    [ModelUnitShape.Sphere]: sphereModelUnitBuilder,
    [ModelUnitShape.Cone]: coneModelUnitBuilder,
  };

  static build<T extends CustomModelUnitConfig>(config: T): Mesh {
    if (!this.map[config.shape]) {
      throw new Error(`Invalid model unit shape: ${config.shape}`);
    }

    return this.map[config.shape](config as never);
  }
}
