import { PlayerCollisionModel } from 'src/player/PlayerCollisionModel';
import { CloudBuilder } from 'src/sky/CloudBuilder';
import { TreeBuilder } from 'src/staticObjects/TreeBuilder';
import { CollisionSystem } from 'src/models/collision/CollisionSystem';
import { CollisionModelController } from 'src/models/collision/CollisionModelController';
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
import { Vector3, Quaternion } from 'three';
import { Entity } from './engine/Entity';
import { GameEngine } from './engine/GameEngine';
import { SurfaceController } from 'src/surface/SurfaceController';
import { GravityProperty } from 'src/velocity/GravityProperty';
import { WindowEventSystem } from 'src/browser/WindowEventSystem';
import { CameraFocusController } from 'src/camera/CameraFocusController';
import { ConfigurableModelController } from './models/configurable/ConfigurableModelController';
import { GltfModelController } from './models/GltfModelController';
import { ModelController } from './models/ModelController';
import { FpsController } from './gui/FpsController';
import { EntityName } from './engine/EntityName';
import { CameraGuiController } from 'src/gui/CameraGuiController';
import { CharacterGuiController } from 'src/gui/CharacterGuiController';
import { LightFocusController } from 'src/sky/LightFocusController';
import { PositionProperty } from './positioning/PositionProperty';
import { RotationProperty } from './positioning/RotationProperty';
import { NameController } from './text/NameController';

export class VoxelGame {

  private readonly engine;

  constructor(
    private randomizer: PseudoRandomizer
  ) {
    console.log('World seed', this.randomizer.seed);

    this.engine = new GameEngine(this.randomizer);

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
      .generateSurface(400, 4000);
    this.engine.systems.register(WaterHelperSystem)
      .configureWater(400, 4000);
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
    this.initTestObjects();
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

  private get surfaceHelper(): SurfaceHelperSystem {
    return this.engine.systems.find(SurfaceHelperSystem);
  }

  private initTestObjects() {
    this.initTestObject1();
    this.initTestObject2();
    this.initTestObject3();
    this.initTestObject4();
    this.initTestObject5();
  }

  private initTestObject1() {
    const x = 20;
    const z = 100;
    const y = this.surfaceHelper.getZCord(x, z);
    const pos = new Vector3(x, y, z);

    const tree = this.engine.entities.register(Entity);
    const modelController = tree.controllers.register(ConfigurableModelController, ModelController);
    tree.properties.register(PositionProperty, pos);
    tree.properties.register(RotationProperty, new Quaternion(0, 0, 0, 1));
    tree.controllers.register(NameController);

    modelController.modelConfig = {
      resourcePath: './resources/unitTrees/SimpleTree.json',
      scale: 1,
      receiveShadow: true,
      castShadow: true,
    };

  }

  private initTestObject2() {
    const x = 40;
    const z = 80;
    const y = this.surfaceHelper.getZCord(x, z);
    const pos = new Vector3(x, y, z);

    const tree = this.engine.entities.register(Entity);
    const modelController = tree.controllers.register(ConfigurableModelController, ModelController);
    tree.properties.register(PositionProperty, pos);
    tree.properties.register(RotationProperty, new Quaternion(0, 0, 0, 1));
    tree.controllers.register(NameController);

    modelController.modelConfig = {
      resourcePath: './resources/unitTrees/BirchTree.json',
      scale: 1,
      receiveShadow: true,
      castShadow: true,
    };
  }

  private initTestObject3() {
    const x = 60;
    const z = 60;
    const y = this.surfaceHelper.getZCord(x, z);
    const pos = new Vector3(x, y, z);

    const tree = this.engine.entities.register(Entity);
    const modelController = tree.controllers.register(ConfigurableModelController, ModelController);
    tree.properties.register(PositionProperty, pos);
    tree.properties.register(RotationProperty, new Quaternion(0, 0, 0, 1));
    tree.controllers.register(NameController);

    modelController.modelConfig = {
      resourcePath: './resources/unitTrees/OakTree.json',
      scale: 1,
      receiveShadow: true,
      castShadow: true,
    };
  }

  private initTestObject4() {
    const x = 80;
    const z = 40;
    const y = this.surfaceHelper.getZCord(x, z);
    const pos = new Vector3(x, y, z);

    const tree = this.engine.entities.register(Entity);
    const modelController = tree.controllers.register(ConfigurableModelController, ModelController);
    tree.properties.register(PositionProperty, pos);
    tree.properties.register(RotationProperty, new Quaternion(0, 0, 0, 1));
    tree.controllers.register(NameController);

    modelController.modelConfig = {
      resourcePath: './resources/unitTrees/PineTree.json',
      scale: 1,
      receiveShadow: true,
      castShadow: true,
    };
  }

  private initTestObject5() {
    const x = 100;
    const z = 20;
    const y = this.surfaceHelper.getZCord(x, z);
    const pos = new Vector3(x, y, z);

    const tree = this.engine.entities.register(Entity);
    const modelController = tree.controllers.register(ConfigurableModelController, ModelController);
    tree.properties.register(PositionProperty, pos);
    tree.properties.register(RotationProperty, new Quaternion(0, 0, 0, 1));
    tree.controllers.register(NameController);

    modelController.modelConfig = {
      resourcePath: './resources/unitTrees/TuyaTree.json',
      scale: 1,
      receiveShadow: true,
      castShadow: true,
    };
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
