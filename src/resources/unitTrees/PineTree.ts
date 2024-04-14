import { Vector3 } from 'three';
import { ConfigurableModelConfig } from '../../models/configurable/ConfigurableModelController';
import { ModelUnitShape } from '../../models/configurable/ModelUnitShape';

export const pineTree: ConfigurableModelConfig = {
  resourcePath: '',
  scale: 1,
  modelConfig: {
    trunk: {
      shape: ModelUnitShape.Cylinder,
      color: 0x805800,
      offset: new Vector3(0, 3, 0),
      height: 6,
      radius: 4,
    },
    crown1: {
      shape: ModelUnitShape.Cone,
      color: 0x57965c,
      offset: new Vector3(0, 11, 0),
      height: 10,
      radiusTop: 6,
      radiusBottom: 12,
    },
    crown2: {
      shape: ModelUnitShape.Cone,
      color: 0x57965c,
      offset: new Vector3(0, 20, 0),
      height: 8,
      radiusTop: 4,
      radiusBottom: 10,
    },
    crown3: {
      shape: ModelUnitShape.Cone,
      color: 0x57965c,
      offset: new Vector3(0, 28, 0),
      height: 8,
      radiusTop: 2,
      radiusBottom: 7,
    },
    crown4: {
      shape: ModelUnitShape.Cone,
      color: 0x57965c,
      offset: new Vector3(0, 35, 0),
      height: 6,
      radiusTop: 0,
      radiusBottom: 4,
    },
  },
  animations: {}
}
