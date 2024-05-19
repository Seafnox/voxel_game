import { PositionProperty } from 'src/positioning/PositionProperty';
import { RotationProperty } from 'src/positioning/RotationProperty';
import { TreeConfig } from 'src/staticObjects/TreeConfig';
import { trees } from 'src/staticObjects/Trees';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { FbxModelController } from 'src/models/FbxModelController';
import { ModelController } from 'src/models/ModelController';
import { SurfaceHelperSystem } from 'src/surface/SurfaceHelperSystem';
import { SurfaceType } from 'src/surface/SurfaceType';
import { NameController } from 'src/text/NameController';
import { VMath } from 'src/VMath';
import { Vector3, Quaternion, Color } from 'three';
import { ControllerConstructor } from '../engine/Controller';
import { ConfigurableModelController } from '../models/configurable/ConfigurableModelController';
import { GltfModelController } from '../models/GltfModelController';
import { ModelType } from '../models/ModelType';

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

  private get surfaceHelper(): SurfaceHelperSystem {
    return this.engine.systems.find(SurfaceHelperSystem);
  }

  buildRandomTree(postfix: string, iteration = 0): void {
    const x = VMath.lerp(this.engine.random(), -this.surfaceHelper.surfaceSize/2, this.surfaceHelper.surfaceSize/2);
    const z = VMath.lerp(this.engine.random(), -this.surfaceHelper.surfaceSize/2, this.surfaceHelper.surfaceSize/2);
    const surfaceType = this.surfaceHelper.getSurfaceType(x, z);

    if (iteration > 4) {
      return;
    }

    if (!(surfaceType in this.surfaceTypeTreeMap)) return this.buildRandomTree(postfix, iteration + 1);

    const y = this.surfaceHelper.getZCord(x, z);
    const pos = new Vector3(x, y, z);
    const availableTrees = this.surfaceTypeTreeMap[surfaceType]!;

    const config = availableTrees[VMath.rand_int(0, availableTrees.length - 1)];
    const tree = this.engine.entities.register(Entity, `${config.name}_${postfix}`);
    tree.properties.register(PositionProperty, pos);
    tree.properties.register(RotationProperty, new Quaternion(0, 0, 0, 1));
    tree.controllers.register(NameController);

    // TODO Make new Collision system
    // const collisionController = tree.controllers.register(CollisionModelController);
    // config.collisionUnits?.forEach(collisionConfig => collisionController.add(collisionConfig));

    const modelController: ModelController = tree.controllers.register(this.getModelController(config.modelType.toString()));
    modelController.modelConfig = {
      resourcePath: config.path,
      scale: config.scale,
      emissive: new Color(this.darkEmissionLight),
      specular: new Color(this.lightAbsorptionMask),
      receiveShadow: true,
      castShadow: true,
    };
  }

  private getModelController(modelType: string): ControllerConstructor<ModelController> {
    switch (modelType) {
      case ModelType.FBX.toString():
        return FbxModelController;
      case ModelType.GLB.toString():
      case ModelType.GLTF.toString():
        return GltfModelController;
      case ModelType.JSON.toString():
        return ConfigurableModelController;
      default:
        throw new Error(`Unknown model type: ${modelType}`);
    }
  }
}
