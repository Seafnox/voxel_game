import { PlayerCollisionModel } from 'src/player/PlayerCollisionModel';
import { CloudBuilder } from 'src/sky/CloudBuilder';
import { TreeBuilder } from 'src/staticObjects/TreeBuilder';
import { CollisionSystem } from 'src/collision/CollisionSystem';
import { CollisionModelController } from 'src/collision/CollisionModelController';
import { RenderController } from 'src/render/RenderController';
import { SkyFocusController } from 'src/sky/SkyFocusController';
import { StateController } from 'src/state/StateController';
import { SimpleWaterController } from 'src/surface/SimpleWaterController';
import { SurfaceHelperSystem } from 'src/surface/SurfaceHelperSystem';
import { SurfaceConfigProperty } from 'src/surface/SurfaceConfigProperty';
import { SurfaceMapProperty } from 'src/surface/SurfaceMapProperty';
import { WaterHelperSystem } from 'src/surface/WaterHelperSystem';
import { WaterConfigProperty } from 'src/surface/WaterConfigProperty';
import { ActivityAccelerationController } from 'src/velocity/ActivityAccelerationController';
import { KeyboardActivityController } from 'src/player/KeyboardActivityController';
import { ActivityDecelerationController } from 'src/velocity/ActivityDecelerationController';
import { ActivityRotationController } from 'src/positioning/ActivityRotationController';
import { DynamicPositionController } from 'src/positioning/DynamicPositionController';
import { IdleUserState } from 'src/player/states/IdleUserState';
import { RunUserState } from 'src/player/states/RunUserState';
import { WalkUserState } from 'src/player/states/WalkUserState';
import { DynamicVelocityController } from 'src/velocity/DynamicVelocityController';
import { CameraProperty } from 'src/camera/CameraProperty';
import { RendererProperty } from 'src/render/RendererProperty';
import { SceneProperty } from 'src/render/SceneProperty';
import { SkyProperty } from 'src/sky/SkyProperty';
import { SunLightProperty } from 'src/sky/SunLightProperty';
import { FontSystem } from 'src/text/FontSystem';
import { KeyboardEventSystem } from 'src/browser/KeyboardEventSystem';
import { ModelSystem } from 'src/models/ModelSystem';
import { MouseEventSystem } from 'src/browser/MouseEventSystem';
import { TickSystem } from 'src/browser/TickSystem';
import { PseudoRandomizer } from 'src/utils/PseudoRandomizer';
import { VMath } from 'src/VMath';
import { Entity } from './engine/Entity';
import { GameEngine } from './engine/GameEngine';
import { SurfaceController } from 'src/surface/SurfaceController';
import { GravityProperty } from 'src/velocity/GravityProperty';
import { WindowEventSystem } from 'src/browser/WindowEventSystem';
import { CameraFocusController } from 'src/camera/CameraFocusController';
import { GltfModelController } from './models/GltfModelController';
import { ModelController } from './models/ModelController';
import { FpsController } from './gui/FpsController';
import { EntityName } from './engine/EntityName';
import { CameraGuiController } from 'src/gui/CameraGuiController';
import { CharacterGuiController } from 'src/gui/CharacterGuiController';
import { LightFocusController } from 'src/sky/LightFocusController';

export class VoxelGame {

  // FIXME import randomizer into engine and refactor Math.random
  private randomizer = new PseudoRandomizer(1152372536);
  private random = this.randomizer.next.bind(this.randomizer);
  private engine = new GameEngine(this.random);

  constructor() {
    console.log('World seed', this.randomizer.seed);
    VMath.random = this.random;

    this.initGlobalProperties();
    this.initGlobalSystems();
    this.initRenderer();

    this.initSurface();

    this.initClouds();
    this.initThrees();
    this.initUnits();
    this.initGui();
  }

  private initGlobalProperties() {
    this.engine.properties.register(RendererProperty);
    this.engine.properties.register(SceneProperty);
    this.engine.properties.register(SunLightProperty);
    this.engine.properties.register(SkyProperty);
    this.engine.properties.register(CameraProperty);
    this.engine.properties.register(GravityProperty);
    this.engine.properties.register(SurfaceConfigProperty);
    this.engine.properties.register(SurfaceMapProperty);
    this.engine.properties.register(WaterConfigProperty);
  }

  private initGlobalSystems() {
    this.engine.systems.register(TickSystem);
    this.engine.systems.register(WindowEventSystem);
    this.engine.systems.register(KeyboardEventSystem);
    this.engine.systems.register(MouseEventSystem);
    this.engine.systems.register(FontSystem);
    this.engine.systems.register(ModelSystem);
    this.engine.systems.register(CollisionSystem);
    this.engine.systems.register(SurfaceHelperSystem)
      .generateSurface(this.random, 400, 4000);
    this.engine.systems.register(WaterHelperSystem)
      .configureWater(this.random,400, 4000);
  }

  private initRenderer() {
    const entity = this.engine.entities.register(Entity);
    entity.controllers.register(RenderController);
  }

  private initSurface(): void {
    const entity = this.engine.entities.register(Entity, EntityName.Surface);
    entity.controllers.register(SurfaceController);
    entity.controllers.register(SimpleWaterController);
  }

  private initClouds() {
    const builder = new CloudBuilder(this.engine);

    for (let i = 0; i < 100; ++i) {
      builder.buildRandomCloud(i.toString());
    }
  }

  private initThrees() {
    const builder = new TreeBuilder(this.engine);

    for (let i = 0; i < 300; ++i) {
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
    const player = this.engine.entities.register(Entity, EntityName.Player);
    const modelController = player.controllers.register(GltfModelController, ModelController);
    const stateController = player.controllers.register(StateController);

    player.controllers.register(KeyboardActivityController);
    player.controllers.register(ActivityAccelerationController);
    player.controllers.register(ActivityDecelerationController);
    player.controllers.register(ActivityRotationController);
    player.controllers.register(DynamicVelocityController);
    player.controllers.register(DynamicPositionController).setNearest(0,0);
    player.controllers.register(LightFocusController);
    player.controllers.register(SkyFocusController);
    player.controllers.register(CameraFocusController);
    player.controllers.register(CollisionModelController)
      .add(PlayerCollisionModel);

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
    const gui = this.engine.entities.register(Entity);

    gui.controllers.register(FpsController);
    gui.controllers.register(CameraGuiController);
    gui.controllers.register(CharacterGuiController);
  }
}
