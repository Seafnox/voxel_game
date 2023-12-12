import { PositionProperty } from 'src/positioning/PositionProperty';
import { RotationProperty } from 'src/positioning/RotationProperty';
import { TreeConfig } from 'src/staticObjects/TreeConfig';
import { trees } from 'src/staticObjects/Trees';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { CollisionModelController } from 'src/collision/CollisionModelController';
import { FbxModelController } from 'src/models/FbxModelController';
import { ModelController } from 'src/models/ModelController';
import { SurfaceType } from 'src/surface/SurfaceType';
import { NameController } from 'src/text/NameController';
import { SurfaceFactor } from 'src/surface/SurfaceFactor';
import { VMath } from 'src/VMath';
import { Vector3, Quaternion, Color } from 'three';

export class TreeBuilder {
  private lightAbsorptionMask = 0x000000;
  private darkEmissionLight = 0x000000;
  private surfaceTypeTreeMap: Partial<Record<SurfaceType, TreeConfig[]>>;

  constructor(
    private engine: GameEngine,
  ) {
    this.surfaceTypeTreeMap = trees.reduce<Partial<Record<SurfaceType, TreeConfig[]>>>((map, treeConfig) => {
      treeConfig.surfaceType.forEach(surfaceType => {
        if (!Array.isArray(map[surfaceType])) {
          map[surfaceType] = [];
        }

        map[surfaceType]!.push(treeConfig);
      });

      return map;
    }, {});

  }

  private get surfaceFactor(): SurfaceFactor {
    return this.engine.factors.find(SurfaceFactor);
  }

  buildRandomTree(postfix: string): void {
    const x = VMath.lerp(this.engine.random(), -this.surfaceFactor.surfaceSize/2, this.surfaceFactor.surfaceSize/2);
    const z = VMath.lerp(this.engine.random(), -this.surfaceFactor.surfaceSize/2, this.surfaceFactor.surfaceSize/2);
    const surfaceType = this.surfaceFactor.getSurfaceType(x, z);

    if (!(surfaceType in this.surfaceTypeTreeMap)) return this.buildRandomTree(postfix);

    const y = this.surfaceFactor.getZCord(x, z);
    const pos = new Vector3(x, y, z);
    const availableTrees = this.surfaceTypeTreeMap[surfaceType]!;

    const config = availableTrees[VMath.rand_int(0, availableTrees.length - 1)];
    const tree = this.engine.entities.create(Entity, `${config.name}_${postfix}`);
    tree.properties.register(PositionProperty, pos);
    tree.properties.register(RotationProperty, new Quaternion(0, 0, 0, 1));
    tree.controllers.register(NameController);

    const collisionController = tree.controllers.register(CollisionModelController);
    config.collisionUnits.forEach(collisionConfig => collisionController.add(collisionConfig));

    const modelController: ModelController = tree.controllers.register(FbxModelController);
    modelController.modelConfig = {
      resourcePath: config.path,
      scale: 0.25,
      emissive: new Color(this.darkEmissionLight),
      specular: new Color(this.lightAbsorptionMask),
      receiveShadow: true,
      castShadow: true,
    };
  }
}
