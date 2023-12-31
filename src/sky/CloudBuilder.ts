import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { GltfModelController } from 'src/models/GltfModelController';
import { PositionProperty } from 'src/positioning/PositionProperty';
import { RotationProperty } from 'src/positioning/RotationProperty';
import { SurfaceHelperSystem } from 'src/surface/SurfaceHelperSystem';
import { VMath } from 'src/VMath';
import { Vector3, Quaternion, Color } from 'three';

export class CloudBuilder {
  private cloudColor = 0xaecfff;
  private cloudHeight = 270;

  constructor(
    private engine: GameEngine,
  ) {}

  private get surfaceHelper(): SurfaceHelperSystem {
    return this.engine.systems.find(SurfaceHelperSystem);
  }

  buildRandomCloud(postfix: string): void {
    const x = VMath.lerp(this.engine.random(), -this.surfaceHelper.surfaceSize/2, this.surfaceHelper.surfaceSize/2);
    const z = VMath.lerp(this.engine.random(), -this.surfaceHelper.surfaceSize/2, this.surfaceHelper.surfaceSize/2);
    const y = this.surfaceHelper.getZCord(x, z);

    if (y > this.cloudHeight) return this.buildRandomCloud(postfix);

    const index = VMath.rand_int(1, 3);
    const pos = new Vector3(x, this.cloudHeight, z);

    const cloudEntity = this.engine.entities.create(Entity, `cloud_${postfix}`);
    cloudEntity.properties.register(PositionProperty, pos);
    cloudEntity.properties.register(RotationProperty, new Quaternion(0,  this.engine.random(), 0, -this.engine.random()));

    const modelController = cloudEntity.controllers.register(GltfModelController);
    modelController.modelConfig = {
      resourcePath: './resources/clouds/Cloud' + index + '.glb',
      scale: this.engine.random() * 5 + 10,
      emissive: new Color(this.cloudColor),
      castShadow: true,
      receiveShadow: true,
    };
  }
}
