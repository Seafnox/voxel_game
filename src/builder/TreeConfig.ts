import { CollisionUnitConfig } from 'src/collision/CollisionModelController';
import { ModelType } from 'src/entity/models/ModelType';
import { Vector3 } from 'three';

export const trees: TreeConfig[] = [
  {
    name: 'PineTree_1',
    modelType: ModelType.FBX,
    path: './resources/pineTree/PineTree_1.fbx',
    collisionUnits: [
      {
        size: new Vector3(10, 55, 10),
        offset: new Vector3(0, -5, 0),
      },
      {
        size: new Vector3(10, 55, 10),
        offset: new Vector3(0, -5, 0),
      },
    ],
  },
  {
    name: 'PineTree_2',
    modelType: ModelType.FBX,
    path: './resources/pineTree/PineTree_2.fbx',
    collisionUnits: [
      {
        size: new Vector3(10, 55, 10),
        offset: new Vector3(0, -5, 0),
      },
    ],
  },
  {
    name: 'PineTree_3',
    modelType: ModelType.FBX,
    path: './resources/pineTree/PineTree_3.fbx',
    collisionUnits: [
      {
        size: new Vector3(9, 42, 9),
        offset: new Vector3(0, -5, 0),
      },
      {
        size: new Vector3(5, 45, 5),
        offset: new Vector3(-3, 32, -8),
      },
    ],
  },
  {
    name: 'PineTree_4',
    modelType: ModelType.FBX,
    path: './resources/pineTree/PineTree_4.fbx',
    collisionUnits: [
      {
        size: new Vector3(9, 35, 10),
        offset: new Vector3(0, -5, 2),
      },
      {
        size: new Vector3(6, 10, 9),
        offset: new Vector3(0, 30, -2.5),
      },
      {
        size: new Vector3(7, 40, 7),
        offset: new Vector3(-3, 40, -6),
      },
    ],
  },
  {
    name: 'PineTree_5',
    modelType: ModelType.FBX,
    path: './resources/pineTree/PineTree_5.fbx',
    collisionUnits: [
      {
        size: new Vector3(8, 67, 8),
        offset: new Vector3(-1, -5, 0),
      },
    ],
  },
  {
    name: 'BirchTree_1',
    modelType: ModelType.FBX,
    path: './resources/brichTree/BirchTree_1.fbx',
    collisionUnits: [
      {
        size: new Vector3(10, 55, 10),
        offset: new Vector3(0, -5, 0),
      },
    ],
  },
  {
    name: 'BirchTree_2',
    modelType: ModelType.FBX,
    path: './resources/brichTree/BirchTree_2.fbx',
    collisionUnits: [
      {
        size: new Vector3(10, 55, 10),
        offset: new Vector3(0, -5, 0),
      },
    ],
  },
  {
    name: 'BirchTree_3',
    modelType: ModelType.FBX,
    path: './resources/brichTree/BirchTree_3.fbx',
    collisionUnits: [
      {
        size: new Vector3(10, 55, 10),
        offset: new Vector3(0, -5, 0),
      },
    ],
  },
  {
    name: 'BirchTree_4',
    modelType: ModelType.FBX,
    path: './resources/brichTree/BirchTree_4.fbx',
    collisionUnits: [
      {
        size: new Vector3(10, 55, 10),
        offset: new Vector3(0, -5, 0),
      },
    ],
  },
  {
    name: 'BirchTree_5',
    modelType: ModelType.FBX,
    path: './resources/brichTree/BirchTree_5.fbx',
    collisionUnits: [
      {
        size: new Vector3(10, 55, 10),
        offset: new Vector3(0, -5, 0),
      },
    ],
  },
  {
    name: 'BirchTree_Dead_1',
    modelType: ModelType.FBX,
    path: './resources/brichTree/BirchTree_Dead_1.fbx',
    collisionUnits: [
      {
        size: new Vector3(10, 55, 10),
        offset: new Vector3(0, -5, 0),
      },
    ],
  },
  {
    name: 'BirchTree_Dead_2',
    modelType: ModelType.FBX,
    path: './resources/brichTree/BirchTree_Dead_2.fbx',
    collisionUnits: [
      {
        size: new Vector3(10, 55, 10),
        offset: new Vector3(0, -5, 0),
      },
    ],
  },
  {
    name: 'BirchTree_Dead_3',
    modelType: ModelType.FBX,
    path: './resources/brichTree/BirchTree_Dead_3.fbx',
    collisionUnits: [
      {
        size: new Vector3(10, 55, 10),
        offset: new Vector3(0, -5, 0),
      },
    ],
  },
  {
    name: 'BirchTree_Dead_4',
    modelType: ModelType.FBX,
    path: './resources/brichTree/BirchTree_Dead_4.fbx',
    collisionUnits: [
      {
        size: new Vector3(10, 55, 10),
        offset: new Vector3(0, -5, 0),
      },
    ],
  },
  {
    name: 'BirchTree_Dead_5',
    modelType: ModelType.FBX,
    path: './resources/brichTree/BirchTree_Dead_5.fbx',
    collisionUnits: [
      {
        size: new Vector3(10, 55, 10),
        offset: new Vector3(0, -5, 0),
      },
    ],
  },
  {
    name: 'CommonTree_1',
    modelType: ModelType.FBX,
    path: './resources/commonTree/CommonTree_1.fbx',
    collisionUnits: [
      {
        size: new Vector3(10, 55, 10),
        offset: new Vector3(0, -5, 0),
      },
    ],
  },
  {
    name: 'CommonTree_2',
    modelType: ModelType.FBX,
    path: './resources/commonTree/CommonTree_2.fbx',
    collisionUnits: [
      {
        size: new Vector3(10, 55, 10),
        offset: new Vector3(0, -5, 0),
      },
    ],
  },
  {
    name: 'CommonTree_3',
    modelType: ModelType.FBX,
    path: './resources/commonTree/CommonTree_3.fbx',
    collisionUnits: [
      {
        size: new Vector3(10, 55, 10),
        offset: new Vector3(0, -5, 0),
      },
    ],
  },
  {
    name: 'CommonTree_4',
    modelType: ModelType.FBX,
    path: './resources/commonTree/CommonTree_4.fbx',
    collisionUnits: [
      {
        size: new Vector3(10, 55, 10),
        offset: new Vector3(0, -5, 0),
      },
    ],
  },
  {
    name: 'CommonTree_5',
    modelType: ModelType.FBX,
    path: './resources/commonTree/CommonTree_5.fbx',
    collisionUnits: [
      {
        size: new Vector3(10, 55, 10),
        offset: new Vector3(0, -5, 0),
      },
    ],
  },
  {
    name: 'CommonTree_Dead_1',
    modelType: ModelType.FBX,
    path: './resources/commonTree/CommonTree_Dead_1.fbx',
    collisionUnits: [
      {
        size: new Vector3(10, 55, 10),
        offset: new Vector3(0, -5, 0),
      },
    ],
  },
  {
    name: 'CommonTree_Dead_2',
    modelType: ModelType.FBX,
    path: './resources/commonTree/CommonTree_Dead_2.fbx',
    collisionUnits: [
      {
        size: new Vector3(10, 55, 10),
        offset: new Vector3(0, -5, 0),
      },
    ],
  },
  {
    name: 'CommonTree_Dead_3',
    modelType: ModelType.FBX,
    path: './resources/commonTree/CommonTree_Dead_3.fbx',
    collisionUnits: [
      {
        size: new Vector3(10, 55, 10),
        offset: new Vector3(0, -5, 0),
      },
    ],
  },
  {
    name: 'CommonTree_Dead_4',
    modelType: ModelType.FBX,
    path: './resources/commonTree/CommonTree_Dead_4.fbx',
    collisionUnits: [
      {
        size: new Vector3(10, 55, 10),
        offset: new Vector3(0, -5, 0),
      },
    ],
  },
  {
    name: 'CommonTree_Dead_5',
    modelType: ModelType.FBX,
    path: './resources/commonTree/CommonTree_Dead_5.fbx',
    collisionUnits: [
      {
        size: new Vector3(10, 55, 10),
        offset: new Vector3(0, -5, 0),
      },
    ],
  },
  {
    name: 'Willow_1',
    modelType: ModelType.FBX,
    path: './resources/willowTree/Willow_1.fbx',
    collisionUnits: [
      {
        size: new Vector3(10, 55, 10),
        offset: new Vector3(0, -5, 0),
      },
    ],
  },
  {
    name: 'Willow_2',
    modelType: ModelType.FBX,
    path: './resources/willowTree/Willow_2.fbx',
    collisionUnits: [
      {
        size: new Vector3(10, 55, 10),
        offset: new Vector3(0, -5, 0),
      },
    ],
  },
  {
    name: 'Willow_3',
    modelType: ModelType.FBX,
    path: './resources/willowTree/Willow_3.fbx',
    collisionUnits: [
      {
        size: new Vector3(10, 55, 10),
        offset: new Vector3(0, -5, 0),
      },
    ],
  },
  {
    name: 'Willow_4',
    modelType: ModelType.FBX,
    path: './resources/willowTree/Willow_4.fbx',
    collisionUnits: [
      {
        size: new Vector3(10, 55, 10),
        offset: new Vector3(0, -5, 0),
      },
    ],
  },
  {
    name: 'Willow_5',
    modelType: ModelType.FBX,
    path: './resources/willowTree/Willow_5.fbx',
    collisionUnits: [
      {
        size: new Vector3(10, 55, 10),
        offset: new Vector3(0, -5, 0),
      },
    ],
  },
  {
    name: 'Willow_Dead_1',
    modelType: ModelType.FBX,
    path: './resources/willowTree/Willow_Dead_1.fbx',
    collisionUnits: [
      {
        size: new Vector3(10, 55, 10),
        offset: new Vector3(0, -5, 0),
      },
    ],
  },
  {
    name: 'Willow_Dead_2',
    modelType: ModelType.FBX,
    path: './resources/willowTree/Willow_Dead_2.fbx',
    collisionUnits: [
      {
        size: new Vector3(10, 55, 10),
        offset: new Vector3(0, -5, 0),
      },
    ],
  },
  {
    name: 'Willow_Dead_3',
    modelType: ModelType.FBX,
    path: './resources/willowTree/Willow_Dead_3.fbx',
    collisionUnits: [
      {
        size: new Vector3(10, 55, 10),
        offset: new Vector3(0, -5, 0),
      },
    ],
  },
  {
    name: 'Willow_Dead_4',
    modelType: ModelType.FBX,
    path: './resources/willowTree/Willow_Dead_4.fbx',
    collisionUnits: [
      {
        size: new Vector3(10, 55, 10),
        offset: new Vector3(0, -5, 0),
      },
    ],
  },
  {
    name: 'Willow_Dead_5',
    modelType: ModelType.FBX,
    path: './resources/willowTree/Willow_Dead_5.fbx',
    collisionUnits: [
      {
        size: new Vector3(10, 55, 10),
        offset: new Vector3(0, -5, 0),
      },
    ],
  },
];

export interface TreeConfig {
  name: string;
  modelType: ModelType;
  path: string;
  collisionUnits: CollisionUnitConfig[];
}
