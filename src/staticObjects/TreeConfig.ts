import { CollisionUnitConfig } from 'src/models/collision/CollisionUnitConfig';
import { ModelType } from 'src/models/ModelType';
import { SurfaceType } from 'src/surface/SurfaceType';

export interface TreeConfig {
  name: string;
  modelType: ModelType;
  surfaceType: SurfaceType[];
  path: string;
  collisionUnits: CollisionUnitConfig[];
}
