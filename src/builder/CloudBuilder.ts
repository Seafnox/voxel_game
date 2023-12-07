import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { GltfModelController } from 'src/entity/models/GltfModelController';
import { PositionProperty, RotationProperty } from 'src/entity/properties/visual';
import { VMath } from 'src/VMath';
import { Vector3, Quaternion, Color } from 'three';

export class CloudBuilder {
  private cloudColor = 0xaecfff;

  constructor(
    private engine: GameEngine,
  ) {}

  buildRandomCloud(postfix: string) {
    const index = VMath.rand_int(1, 3);
    const pos = new Vector3(
      (this.engine.random() * 2.0 - 1.0) * 500,
      270,
      (this.engine.random() * 2.0 - 1.0) * 500,
    );

    const cloudEntity = this.engine.entities.create(Entity, `cloud_${postfix}`);
    cloudEntity.setProperty(PositionProperty, pos);
    cloudEntity.setProperty(RotationProperty, new Quaternion(0,0,0,1));

    const modelController = cloudEntity.create(GltfModelController);
    modelController.modelConfig = {
      resourcePath: './resources/clouds/Cloud' + index + '.glb',
      scale: this.engine.random() * 5 + 10,
      emissive: new Color(this.cloudColor),
      castShadow: true,
      receiveShadow: true,
    };
  }
}
