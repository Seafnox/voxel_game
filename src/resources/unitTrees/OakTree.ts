import { Vector3 } from 'three';
import { ConfigurableModelConfig } from '../../models/configurable/ConfigurableModelController';
import { ModelUnitShape } from '../../models/configurable/ModelUnitShape';

export const oakTree: ConfigurableModelConfig = {
  resourcePath: '',
  scale: 1,
  modelConfig: {
    trunk: {
      shape: ModelUnitShape.Cylinder,
      color: 0x805800,
      offset: new Vector3(0, 8, 0),
      height: 16,
      radius: 1,
    },
    crown1: {
      shape: ModelUnitShape.Box,
      color: 0x57965c,
      offset: new Vector3(0, 24, 0),
      size: new Vector3(10, 16, 10),
    },
    crown2: {
      shape: ModelUnitShape.Box,
      color: 0x57965c,
      offset: new Vector3(5, 35, 0),
      size: new Vector3(5, 6, 5),
    }
  },
  animations: {}
}
