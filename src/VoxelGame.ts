import { CloudBuilder } from 'src/builder/CloudBuilder';
import { TreeBuilder } from 'src/builder/TreeBuilder';
import { CollisionFactor } from 'src/collision/CollisionFactor';
import { CollisionModelController } from 'src/collision/CollisionModelController';
import { RenderController } from 'src/entity/environment/RenderController';
import { SkyFocusController } from 'src/entity/SkyFocusController';
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
import { SunLightFactor } from 'src/factor/SunLightFactor';
import { FontSystem } from 'src/system/FontSystem';
import { KeyboardEventSystem } from 'src/system/KeyboardEventSystem';
import { ModelSystem } from 'src/system/ModelSystem';
import { MouseEventSystem } from 'src/system/MouseEventSystem';
import { TickSystem } from 'src/system/TickSystem';
import { PseudoRandomizer } from 'src/utils/PseudoRandomizer';
import { VMath } from 'src/VMath';
import { Vector3 } from 'three';
import { Entity } from './engine/Entity';
import { GameEngine } from './engine/GameEngine';
import { SurfaceController } from './entity/environment/SurfaceController';
import { GravityFactor } from './factor/GravityFactor';
import { SurfaceFactor } from './factor/surface/SurfaceFactor';
import { WindowEventSystem } from './system/WindowEventSystem';
import { CameraFocusController } from 'src/entity/CameraFocusController';
import { GltfModelController } from './entity/models/GltfModelController';
import { ModelController } from './entity/models/ModelController';
import { FpsController } from './entity/hud/FpsController';
import { EntityName } from './engine/EntityName';
import { CameraHudController } from './entity/hud/CameraHudController';
import { CharacterHudController } from './entity/hud/CharacterHudController';
import { LightFocusController } from 'src/entity/LightFocusController';

export class VoxelGame {

  // FIXME import randomizer into engine and refactor Math.random
  private randomizer = new PseudoRandomizer(1152372536);
  private random = this.randomizer.next.bind(this.randomizer);
  private engine = new GameEngine(this.random);

  constructor() {
    console.log('World seed', this.randomizer.seed);
    VMath.random = this.random;

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
      .generateSurface(this.random, 400, 4000);
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
    const builder = new CloudBuilder(this.engine);

    for (let i = 0; i < 25; ++i) {
      builder.buildRandomCloud(i.toString());
    }
  }

  private initThrees() {
    const builder = new TreeBuilder(this.engine);

    for (let i = 0; i < 100; ++i) {
      builder.buildRandomTree(i.toString());
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
