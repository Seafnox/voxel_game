import { ModelType } from 'src/models/ModelType';
import { TreeConfig } from 'src/staticObjects/TreeConfig';
import { SurfaceType } from 'src/surface/SurfaceType';

export const trees: TreeConfig[] = [
  {
    name: 'PineTree',
    modelType: ModelType.JSON,
    scale: 1,
    surfaceType: [SurfaceType.Hill, SurfaceType.Rock, SurfaceType.Mountain],
    path: './resources/unitTrees/PineTree.json',
  },
  {
    name: 'BirchTree',
    modelType: ModelType.JSON,
    scale: 1,
    surfaceType: [SurfaceType.Plain, SurfaceType.Hill],
    path: './resources/unitTrees/BirchTree.json',
  },
  {
    name: 'SimpleTree',
    modelType: ModelType.JSON,
    scale: 1,
    surfaceType: [SurfaceType.Seaside, SurfaceType.Plain],
    path: './resources/unitTrees/SimpleTree.json',
  },
  {
    name: 'OakTree',
    modelType: ModelType.JSON,
    scale: 1,
    surfaceType: [SurfaceType.Seaside, SurfaceType.Plain],
    path: './resources/unitTrees/OakTree.json',
  },
  {
    name: 'TuyaTree',
    modelType: ModelType.JSON,
    scale: 1,
    surfaceType: [SurfaceType.Plain, SurfaceType.Hill, SurfaceType.Rock],
    path: './resources/unitTrees/TuyaTree.json',
  },
];

