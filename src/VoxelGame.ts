import { availableTrees } from 'src/availableTrees';
import { CollisionFactor } from 'src/collision/CollisionFactor';
import { CollisionModelController } from 'src/entity/CollisionModelController';
import { RenderController } from 'src/entity/environment/RenderController';
import { SkyFocusController } from 'src/entity/SkyFocusController';
import { FbxModelController } from 'src/entity/models/FbxModelController';
import { NameController } from 'src/entity/NameController';
import { PositionProperty, RotationProperty } from 'src/entity/properties/visual';
import { StateController } from 'src/entity/state/StateController';
import { ActivityAccelerationController } from 'src/entity/ActivityAccelerationController';
import { KeyboardActivityController } from 'src/entity/user/KeyboardActivityController';
import { ActivityDecelerationController } from 'src/entity/ActivityDecelerationController';
import { ActivityRotationController } from 'src/entity/ActivityRotationController';
import { DynamicPositionController } from 'src/entity/DynamicPositionController';
import { IdleUserState } from 'src/entity/user/states/IdleUserState';
import { RunUserState } from 'src/entity/user/states/RunUserState';
import { WalkUserState } from 'src/entity/user/states/WalkUserState';
import { DynamicVelocityController } from 'src/entity/DynamicVelocityController';
import { CameraFactor } from 'src/factor/CameraFactor';
import { RendererFactor } from 'src/factor/RendererFactor';
import { SceneFactor } from 'src/factor/SceneFactor';
import { SkyFactor } from 'src/factor/SkyFactor';
import { SpatialFactor } from 'src/factor/SpatialFactor';
import { SunLightFactor } from 'src/factor/SunLightFactor';
import { FontSystem } from 'src/system/FontSystem';
import { KeyboardEventSystem } from 'src/system/KeyboardEventSystem';
import { ModelSystem } from 'src/system/ModelSystem';
import { MouseEventSystem } from 'src/system/MouseEventSystem';
import { TickSystem } from 'src/system/TickSystem';
import {
  Color,
  Vector3,
  Quaternion,
} from 'three';
import { Entity } from './engine/Entity';
import { GameEngine } from './engine/GameEngine';
import { SurfaceController } from './entity/environment/SurfaceController';
import { GravityFactor } from './factor/GravityFactor';
import { SurfaceFactor } from './factor/surface/SurfaceFactor';
import { WindowEventSystem } from './system/WindowEventSystem';
import { VMath } from './VMath';
import { CameraFocusController } from 'src/entity/CameraFocusController';
import { GltfModelController } from './entity/models/GltfModelController';
import { ModelController } from './entity/models/ModelController';
import { FpsController } from './entity/hud/FpsController';
import { EntityName } from './engine/EntityName';
import { CameraHudController } from './entity/hud/CameraHudController';
import { CharacterHudController } from './entity/hud/CharacterHudController';
import { LightFocusController } from 'src/entity/LightFocusController';

export class VoxelGame {
  private cloudColor = 0xaecfff;
  private lightAbsorptionMask = 0x000000;
  private darkEmissionLight = 0x000000;

  private engine = new GameEngine();

  constructor() {
    this.initFactors();
    this.initSystems();
    this.initRenderer();

    this.initSurface();

    this.initClouds();
    this.initThrees();
    this.initUnits();
    this.initGui();
  }

  private initFactors() {
    this.engine.factors.create(RendererFactor);
    this.engine.factors.create(SceneFactor);
    this.engine.factors.create(SunLightFactor);
    this.engine.factors.create(SkyFactor);
    this.engine.factors.create(CameraFactor);
    this.engine.factors.create(GravityFactor);
    this.engine.factors.create(SurfaceFactor)
      .generateSurface(400, 4000);
    this.engine.factors.create(SpatialFactor)
      .generateGrid(1000, 10);
    this.engine.factors.create(CollisionFactor);
  }

  private initSystems() {
    this.engine.systems.create(TickSystem);
    this.engine.systems.create(WindowEventSystem);
    this.engine.systems.create(KeyboardEventSystem);
    this.engine.systems.create(MouseEventSystem);
    this.engine.systems.create(FontSystem);
    this.engine.systems.create(ModelSystem);
  }

  private initRenderer() {
    const entity = this.engine.entities.create(Entity);
    entity.create(RenderController);
  }

  private initSurface(): void {
    const entity = this.engine.entities.create(Entity, EntityName.Surface);
    entity.create(SurfaceController);
  }

  private initClouds() {
    for (let i = 0; i < 25; ++i) {
      const index = VMath.rand_int(1, 3);
      const pos = new Vector3(
        (Math.random() * 2.0 - 1.0) * 500,
        250,
        (Math.random() * 2.0 - 1.0) * 500,
      );

      const cloudEntity = this.engine.entities.create(Entity, `cloud_${i}`);
      cloudEntity.setProperty(PositionProperty, pos);
      cloudEntity.setProperty(RotationProperty, new Quaternion(0,0,0,1));

      const modelController = cloudEntity.create(GltfModelController);
      modelController.modelConfig = {
        resourcePath: './resources/clouds/Cloud' + index + '.glb',
        scale: Math.random() * 5 + 10,
        emissive: new Color(this.cloudColor),
        castShadow: true,
        receiveShadow: true,
      };

    }
  }

  private initThrees() {
    const surfaceFactor = this.engine.factors.find(SurfaceFactor);
    for (let i = 0; i < 100; ++i) {
      const name = availableTrees[VMath.rand_int(0, availableTrees.length - 1)];
      const x = (Math.random() * 2.0 - 1.0) * 500;
      const z = (Math.random() * 2.0 - 1.0) * 500;
      const y = surfaceFactor.getZCord(x,z);

      const pos = new Vector3(x,y,z);

      const tree = this.engine.entities.create(Entity, `${name}_${i}`);
      tree.setProperty(PositionProperty, pos);
      tree.setProperty(RotationProperty, new Quaternion(0,0,0,1));
      tree.create(NameController);
      tree.create(CollisionModelController)
        .add({
          size: new Vector3(10, 55, 10),
          offset: new Vector3(0, -5, 0),
        })
        .add({
          size: new Vector3(50, 10, 50),
          offset: new Vector3(0, 50, 0),
        });

      const modelController = tree.create(FbxModelController);
      modelController.modelConfig = {
        resourcePath: './resources/' + name + '.fbx',
        scale: 0.25,
        emissive: new Color(this.darkEmissionLight),
        specular: new Color(this.lightAbsorptionMask),
        receiveShadow: true,
        castShadow: true,
      };

    }
  }

  private initUnits() {
    this.initPlayer();
    this.initNPC();
    this.initEnemies();
    this.initQuestPlaces();
    this.initItems();
  }

  private initPlayer() {
    const player = this.engine.entities.create(Entity, EntityName.Player);
    const modelController = player.create(GltfModelController, ModelController);
    const stateController = player.create(StateController);

    player.create(KeyboardActivityController);
    player.create(ActivityAccelerationController);
    player.create(ActivityDecelerationController);
    player.create(ActivityRotationController);
    player.create(DynamicVelocityController);
    player.create(DynamicPositionController).setNearest(0,0);
    player.create(LightFocusController);
    player.create(SkyFocusController);
    player.create(CameraFocusController);
    player.create(CollisionModelController)
      .add({
        size: new Vector3(6, 9.5, 6),
      });

    modelController.modelConfig = {
      resourcePath: './resources/units/guard.glb',
      scale: 15,
      receiveShadow: true,
      castShadow: true,
    };

    stateController.addState(IdleUserState);
    stateController.addState(WalkUserState);
    stateController.addState(RunUserState);

    stateController.setState(IdleUserState);

    // player.AddComponent(new EquipWeapon({anchor: 'RightHandIndex1'}));
    // player.AddComponent(new InventoryController(params));
    // player.AddComponent(new AttackController({timing: 0.7}));
    // player.AddComponent(new HealthComponent({
    //   updateUI: true,
    //   health: 100,
    //   maxHealth: 100,
    //   strength: 50,
    //   wisdomness: 5,
    //   benchpress: 20,
    //   curl: 100,
    //   experience: 0,
    //   level: 1,
    // }));
  }

  private initNPC() {
    // TODO create when dynamic objects could be created
  }

  private initEnemies() {
    // TODO create when dynamic objects could be created
  }

  private initQuestPlaces() {
    // TODO create when dynamic objects could be created
  }

  private initItems() {
    // TODO create when dynamic objects could be created
  }

  private initGui() {
    const gui = this.engine.entities.create(Entity);

    gui.create(FpsController);
    gui.create(CameraHudController);
    gui.create(CharacterHudController);
  }
}
