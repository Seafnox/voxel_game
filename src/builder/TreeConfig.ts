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
    path: './resources/birchTree/BirchTree_1.fbx',
    collisionUnits: [
      {
        size: new Vector3(5, 20, 7),
        offset: new Vector3(-2, -5, -2),
      },
      {
        size: new Vector3(5, 10, 12),
        offset: new Vector3(0, 15, -6),
      },
      {
        size: new Vector3(6, 30, 6),
        offset: new Vector3(5.5, 25, -0.5),
      },
      {
        size: new Vector3(6, 14, 5),
        offset: new Vector3(2, 23, -15),
      },
      {
        size: new Vector3(6, 10, 13),
        offset: new Vector3(2, 25, -25),
      },
      {
        size: new Vector3(6, 18, 13),
        offset: new Vector3(2, 35, -31),
      },
    ],
  },
  {
    name: 'BirchTree_2',
    modelType: ModelType.FBX,
    path: './resources/birchTree/BirchTree_2.fbx',
    collisionUnits: [
      {
        size: new Vector3(6, 24, 6),
        offset: new Vector3(0, -5, 1),
      },
      {
        size: new Vector3(6, 10, 6),
        offset: new Vector3(0, 17, 7),
      },
      {
        size: new Vector3(6, 10, 6),
        offset: new Vector3(0, 26, 13),
      },
      {
        size: new Vector3(15, 25, 17),
        offset: new Vector3(-1, 36, 12),
      },
    ],
  },
  {
    name: 'BirchTree_3',
    modelType: ModelType.FBX,
    path: './resources/birchTree/BirchTree_3.fbx',
    collisionUnits: [
      {
        size: new Vector3(6, 73, 6),
        offset: new Vector3(0, -5, 0),
      },
      {
        size: new Vector3(8, 12, 6),
        offset: new Vector3(7, 26, 2),
      },
      {
        size: new Vector3(6, 21, 12),
        offset: new Vector3(6, 30, -9),
      },
      {
        size: new Vector3(6, 30, 10),
        offset: new Vector3(0, 48, -8),
      },
    ],
  },
  {
    name: 'BirchTree_4',
    modelType: ModelType.FBX,
    path: './resources/birchTree/BirchTree_4.fbx',
    collisionUnits: [
      {
        size: new Vector3(8, 17, 6),
        offset: new Vector3(4, -5, 0),
      },
      {
        size: new Vector3(6, 12, 7),
        offset: new Vector3(2, 12, -3.5),
      },
      {
        size: new Vector3(7, 38, 12),
        offset: new Vector3(-1.5, 18, -13),
      },
      {
        size: new Vector3(6, 17, 6),
        offset: new Vector3(0, 50, -19),
      },
      {
        size: new Vector3(6, 20, 22),
        offset: new Vector3(-1, 30, -30),
      },
      {
        size: new Vector3(6, 28, 8),
        offset: new Vector3(0, 20, 4),
      },
      {
        size: new Vector3(6, 16, 16),
        offset: new Vector3(0, 30, 16),
      },
    ],
  },
  {
    name: 'BirchTree_5',
    modelType: ModelType.FBX,
    path: './resources/birchTree/BirchTree_5.fbx',
    collisionUnits: [
      {
        size: new Vector3(7, 90, 7),
        offset: new Vector3(0, -5, 0),
      },
      {
        size: new Vector3(16, 20, 14),
        offset: new Vector3(0, 85, 0),
      },
      {
        size: new Vector3(7, 25, 14),
        offset: new Vector3(2, 35, -10.5),
      },
    ],
  },
  {
    name: 'BirchTree_Dead_1',
    modelType: ModelType.FBX,
    path: './resources/birchTree/BirchTree_Dead_1.fbx',
    collisionUnits: [
      {
        size: new Vector3(5, 20, 7),
        offset: new Vector3(-2, -5, -2),
      },
      {
        size: new Vector3(5, 10, 12),
        offset: new Vector3(0, 15, -6),
      },
      {
        size: new Vector3(6, 30, 6),
        offset: new Vector3(5.5, 25, -0.5),
      },
      {
        size: new Vector3(6, 14, 5),
        offset: new Vector3(2, 23, -15),
      },
      {
        size: new Vector3(6, 10, 13),
        offset: new Vector3(2, 25, -25),
      },
      {
        size: new Vector3(6, 18, 13),
        offset: new Vector3(2, 35, -31),
      },
    ],
  },
  {
    name: 'BirchTree_Dead_2',
    modelType: ModelType.FBX,
    path: './resources/birchTree/BirchTree_Dead_2.fbx',
    collisionUnits: [
      {
        size: new Vector3(6, 24, 6),
        offset: new Vector3(0, -5, 1),
      },
      {
        size: new Vector3(6, 10, 6),
        offset: new Vector3(0, 17, 7),
      },
      {
        size: new Vector3(6, 10, 6),
        offset: new Vector3(0, 26, 13),
      },
      {
        size: new Vector3(15, 25, 17),
        offset: new Vector3(-1, 36, 12),
      },
    ],
  },
  {
    name: 'BirchTree_Dead_3',
    modelType: ModelType.FBX,
    path: './resources/birchTree/BirchTree_Dead_3.fbx',
    collisionUnits: [
      {
        size: new Vector3(6, 73, 6),
        offset: new Vector3(0, -5, 0),
      },
      {
        size: new Vector3(8, 12, 6),
        offset: new Vector3(7, 26, 2),
      },
      {
        size: new Vector3(6, 21, 12),
        offset: new Vector3(6, 30, -9),
      },
      {
        size: new Vector3(6, 30, 10),
        offset: new Vector3(0, 48, -8),
      },
    ],
  },
  {
    name: 'BirchTree_Dead_4',
    modelType: ModelType.FBX,
    path: './resources/birchTree/BirchTree_Dead_4.fbx',
    collisionUnits: [
      {
        size: new Vector3(8, 17, 6),
        offset: new Vector3(4, -5, 0),
      },
      {
        size: new Vector3(6, 12, 7),
        offset: new Vector3(2, 12, -3.5),
      },
      {
        size: new Vector3(7, 38, 12),
        offset: new Vector3(-1.5, 18, -13),
      },
      {
        size: new Vector3(6, 17, 6),
        offset: new Vector3(0, 50, -19),
      },
      {
        size: new Vector3(6, 20, 22),
        offset: new Vector3(-1, 30, -30),
      },
      {
        size: new Vector3(6, 28, 8),
        offset: new Vector3(0, 20, 4),
      },
      {
        size: new Vector3(6, 16, 16),
        offset: new Vector3(0, 30, 16),
      },
    ],
  },
  {
    name: 'BirchTree_Dead_5',
    modelType: ModelType.FBX,
    path: './resources/birchTree/BirchTree_Dead_5.fbx',
    collisionUnits: [
      {
        size: new Vector3(7, 90, 7),
        offset: new Vector3(0, -5, 0),
      },
      {
        size: new Vector3(16, 20, 14),
        offset: new Vector3(0, 85, 0),
      },
      {
        size: new Vector3(7, 25, 14),
        offset: new Vector3(2, 35, -10.5),
      },
    ],
  },
  {
    name: 'CommonTree_1',
    modelType: ModelType.FBX,
    path: './resources/commonTree/CommonTree_1.fbx',
    collisionUnits: [
      {
        size: new Vector3(5, 20, 5),
        offset: new Vector3(0, -5, 0),
      },
      {
        size: new Vector3(4, 5, 15),
        offset: new Vector3(0, 15, 2),
      },
      {
        size: new Vector3(4, 5, 6),
        offset: new Vector3(0, 20, -7),
      },
      {
        size: new Vector3(4, 5, 6),
        offset: new Vector3(0, 20, 11),
      },
      {
        size: new Vector3(4, 5, 5),
        offset: new Vector3(0, 25, -10),
      },
      {
        size: new Vector3(4, 5, 7),
        offset: new Vector3(0, 25, 15),
      },
      {
        size: new Vector3(25, 20, 26),
        offset: new Vector3(-1, 30, -10),
      },
      {
        size: new Vector3(15, 15, 15),
        offset: new Vector3(0, 30, 21),
      },
    ],
  },
  {
    name: 'CommonTree_2',
    modelType: ModelType.FBX,
    path: './resources/commonTree/CommonTree_2.fbx',
    collisionUnits: [
      {
        size: new Vector3(6, 45, 6),
        offset: new Vector3(0, -5, 0),
      },
      {
        size: new Vector3(28, 30, 28),
        offset: new Vector3(0, 40, 0),
      },
      {
        size: new Vector3(5, 12, 17),
        offset: new Vector3(0, 18, 11),
      },
      {
        size: new Vector3(23, 16, 17),
        offset: new Vector3(0, 30, 21),
      },
    ],
  },
  {
    name: 'CommonTree_3',
    modelType: ModelType.FBX,
    path: './resources/commonTree/CommonTree_3.fbx',
    collisionUnits: [
      {
        size: new Vector3(6, 50, 6),
        offset: new Vector3(0, -5, 0),
      },
      {
        size: new Vector3(10, 28, 15),
        offset: new Vector3(0, 45, 0),
      },
      {
        size: new Vector3(11, 20, 21),
        offset: new Vector3(-8, 30, 2),
      },
    ],
  },
  {
    name: 'CommonTree_4',
    modelType: ModelType.FBX,
    path: './resources/commonTree/CommonTree_4.fbx',
    collisionUnits: [
      {
        size: new Vector3(6, 40, 6),
        offset: new Vector3(0, -5, 0),
      },
      {
        size: new Vector3(19, 30, 25),
        offset: new Vector3(-3, 35, -7),
      },
    ],
  },
  {
    name: 'CommonTree_5',
    modelType: ModelType.FBX,
    path: './resources/commonTree/CommonTree_5.fbx',
    collisionUnits: [
      {
        size: new Vector3(6, 10, 6),
        offset: new Vector3(0, -5, 0),
      },
      {
        size: new Vector3(6, 23, 6),
        offset: new Vector3(0, 5, 3),
      },
      {
        size: new Vector3(21, 23, 30),
        offset: new Vector3(-4, 28, 7),
      },
    ],
  },
  {
    name: 'CommonTree_Dead_1',
    modelType: ModelType.FBX,
    path: './resources/commonTree/CommonTree_Dead_1.fbx',
    collisionUnits: [
      {
        size: new Vector3(5, 20, 5),
        offset: new Vector3(0, -5, 0),
      },
      {
        size: new Vector3(4, 5, 15),
        offset: new Vector3(0, 15, 2),
      },
      {
        size: new Vector3(4, 5, 6),
        offset: new Vector3(0, 20, -7),
      },
      {
        size: new Vector3(4, 5, 6),
        offset: new Vector3(0, 20, 11),
      },
      {
        size: new Vector3(4, 5, 5),
        offset: new Vector3(0, 25, -10),
      },
      {
        size: new Vector3(4, 5, 7),
        offset: new Vector3(0, 25, 15),
      },
      {
        size: new Vector3(25, 20, 26),
        offset: new Vector3(-1, 30, -10),
      },
      {
        size: new Vector3(15, 15, 15),
        offset: new Vector3(0, 30, 21),
      },
    ],
  },
  {
    name: 'CommonTree_Dead_2',
    modelType: ModelType.FBX,
    path: './resources/commonTree/CommonTree_Dead_2.fbx',
    collisionUnits: [
      {
        size: new Vector3(6, 45, 6),
        offset: new Vector3(0, -5, 0),
      },
      {
        size: new Vector3(28, 30, 28),
        offset: new Vector3(0, 40, 0),
      },
      {
        size: new Vector3(5, 12, 17),
        offset: new Vector3(0, 18, 11),
      },
      {
        size: new Vector3(23, 16, 17),
        offset: new Vector3(0, 30, 21),
      },
    ],
  },
  {
    name: 'CommonTree_Dead_3',
    modelType: ModelType.FBX,
    path: './resources/commonTree/CommonTree_Dead_3.fbx',
    collisionUnits: [
      {
        size: new Vector3(6, 50, 6),
        offset: new Vector3(0, -5, 0),
      },
      {
        size: new Vector3(10, 28, 15),
        offset: new Vector3(0, 45, 0),
      },
      {
        size: new Vector3(11, 20, 21),
        offset: new Vector3(-8, 30, 2),
      },
    ],
  },
  {
    name: 'CommonTree_Dead_4',
    modelType: ModelType.FBX,
    path: './resources/commonTree/CommonTree_Dead_4.fbx',
    collisionUnits: [
      {
        size: new Vector3(6, 40, 6),
        offset: new Vector3(0, -5, 0),
      },
      {
        size: new Vector3(19, 30, 25),
        offset: new Vector3(-3, 35, -7),
      },
    ],
  },
  {
    name: 'CommonTree_Dead_5',
    modelType: ModelType.FBX,
    path: './resources/commonTree/CommonTree_Dead_5.fbx',
    collisionUnits: [
      {
        size: new Vector3(6, 10, 6),
        offset: new Vector3(0, -5, 0),
      },
      {
        size: new Vector3(6, 23, 6),
        offset: new Vector3(0, 5, 3),
      },
      {
        size: new Vector3(21, 23, 30),
        offset: new Vector3(-4, 28, 7),
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
