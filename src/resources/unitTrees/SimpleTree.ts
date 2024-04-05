import { Vector3 } from 'three';
import { ConfigurableModelConfig } from '../../models/configurable/ConfigurableModelController';
import { ModelUnitShape } from '../../models/configurable/ModelUnitShape';

export const simpleTree: ConfigurableModelConfig = {
  resourcePath: '',
  scale: 1,
  modelConfig: {
    trunk: {
      shape: ModelUnitShape.Cyllinder,
      color: 0x805800,
      offset: new Vector3(0, 5, 0),
      height: 10,
      radius: 2,
    },
    crown1: {
      shape: ModelUnitShape.Box,
      color: 0x57965c,
      offset: new Vector3(0, 18, 0),
      size: new Vector3(10, 16, 10),
    },
    crown2: {
      shape: ModelUnitShape.Box,
      color: 0x57965c,
      offset: new Vector3(5, 29, 0),
      size: new Vector3(5, 6, 5),
    }
  },
  animations: {}
}
