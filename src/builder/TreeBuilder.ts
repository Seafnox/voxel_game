import { trees } from 'src/builder/TreeConfig';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { CollisionModelController } from 'src/collision/CollisionModelController';
import { FbxModelController } from 'src/entity/models/FbxModelController';
import { ModelController } from 'src/entity/models/ModelController';
import { NameController } from 'src/entity/NameController';
import { PositionProperty, RotationProperty } from 'src/entity/properties/visual';
import { SurfaceFactor } from 'src/factor/surface/SurfaceFactor';
import { VMath } from 'src/VMath';
import { Vector3, Quaternion, Color } from 'three';

export class TreeBuilder {
  private lightAbsorptionMask = 0x000000;
  private darkEmissionLight = 0x000000;

  constructor(
    private engine: GameEngine,
  ) {}

  private get surfaceFactor(): SurfaceFactor {
    return this.engine.factors.find(SurfaceFactor);
  }

  buildRandomTree(postfix: string) {
    const config = trees[VMath.rand_int(0, trees.length - 1)];
    const x = (this.engine.random() * 2.0 - 1.0) * 500;
    const z = (this.engine.random() * 2.0 - 1.0) * 500;
    const y = this.surfaceFactor.getZCord(x, z);

    const pos = new Vector3(x, y, z);

    const tree = this.engine.entities.create(Entity, `${config.name}_${postfix}`);
    tree.setProperty(PositionProperty, pos);
    tree.setProperty(RotationProperty, new Quaternion(0, 0, 0, 1));
    tree.create(NameController);

    const collisionController = tree.create(CollisionModelController);
    config.collisionUnits.forEach(collisionConfig => collisionController.add(collisionConfig));

    const modelController: ModelController = tree.create(FbxModelController);
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
