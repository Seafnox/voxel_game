import { BaseModelUnitConfig } from './BaseModelUnitConfig';
import { BoxModelUnitConfig } from './BoxModelUnitConfig';
import { ConeModelUnitConfig } from './ConeModelUnitConfig';
import { CylinderModelUnitConfig } from './CylinderModelUnitConfig';
import { SphereModelUnitConfig } from './SphereModelUnitConfig';

export type CustomModelUnitConfig =
  BaseModelUnitConfig
  | BoxModelUnitConfig
  | ConeModelUnitConfig
  | CylinderModelUnitConfig
  | SphereModelUnitConfig;
