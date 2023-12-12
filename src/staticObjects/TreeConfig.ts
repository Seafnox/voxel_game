import { CollisionUnitConfig } from 'src/collision/CollisionUnitConfig';
import { ModelType } from 'src/models/ModelType';
import { SurfaceType } from 'src/surface/SurfaceType';

export interface TreeConfig {
  name: string;
  modelType: ModelType;
  surfaceType: SurfaceType[];
  path: string;
  collisionUnits: CollisionUnitConfig[];
}
