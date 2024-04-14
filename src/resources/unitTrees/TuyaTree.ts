import { Vector3 } from 'three';
import { ConfigurableModelConfig } from '../../models/configurable/ConfigurableModelController';
import { ModelUnitShape } from '../../models/configurable/ModelUnitShape';

export const tuyaTree: ConfigurableModelConfig = {
  resourcePath: '',
  scale: 1,
  modelConfig: {
    trunk: {
      shape: ModelUnitShape.Cone,
      color: 0x805800,
      offset: new Vector3(0, 29, 0),
      height: 56,
      radiusTop: 0,
      radiusBottom: 2,
    },
    crown1: {
      shape: ModelUnitShape.Cone,
      color: 0x57965c,
      offset: new Vector3(0, 9, 0),
      height: 10,
      radiusTop: 4,
      radiusBottom: 1,
    },
    crown2: {
      shape: ModelUnitShape.Cone,
      color: 0x57965c,
      offset: new Vector3(0, 24, 0),
      height: 20,
      radiusTop: 6,
      radiusBottom: 4,
    },
    crown3: {
      shape: ModelUnitShape.Cone,
      color: 0x57965c,
      offset: new Vector3(0, 42, 0),
      height: 16,
      radiusTop: 3,
      radiusBottom: 6,
    },
    crown4: {
      shape: ModelUnitShape.Cone,
      color: 0x57965c,
      offset: new Vector3(0, 56, 0),
      height: 12,
      radiusTop: 0,
      radiusBottom: 3,
    },
  },
  animations: {}
}
