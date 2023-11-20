import { SkyController } from 'src/entity/environment/SkyController';
import { StateController } from 'src/entity/state/StateController';
import { ActivityAccelerationController } from 'src/entity/ActivityAccelerationController';
import { KeyboardActivityController } from 'src/entity/user/KeyboardActivityController';
import { ActivityDecelerationController } from 'src/entity/ActivityDecelerationController';
import { GravityAccelerationController } from 'src/entity/GravityAccelerationController';
import { ActivityRotationController, RotationProperty } from 'src/entity/ActivityRotationController';
import { DynamicPositionController, PositionProperty } from 'src/entity/DynamicPositionController';
import { IdleUserState } from 'src/entity/user/states/IdleUserState';
import { RunUserState } from 'src/entity/user/states/RunUserState';
import { WalkUserState } from 'src/entity/user/states/WalkUserState';
import { VelocityController } from 'src/entity/VelocityController';
import { SceneFactor } from 'src/factor/SceneFactor';
import { KeyboardEventSystem } from 'src/system/KeyboardEventSystem';
import { MouseEventSystem } from 'src/system/MouseEventSystem';
import { TickSystem, TickSystemEvent } from 'src/system/TickSystem';
import {
  WebGLRenderer,
  Color,
  Vector3, Quaternion,
} from 'three';
import { SRGBColorSpace, PCFSoftShadowMap } from 'three/src/constants';
import { Entity } from './engine/Entity';
import { GameEngine } from './engine/GameEngine';
import { SurfaceController } from './entity/environment/SurfaceController';
import { StaticModelController } from './entity/models/StaticModelController';
import { GravityFactor } from './factor/GravityFactor';
import { SurfaceFactor } from './factor/surface/SurfaceFactor';
import { SpatialGridController } from './entity/grid/SpatialGridController';
import { WindowEventSystem, WindowTopic, WindowResizeEvent } from './system/WindowEventSystem';
import { getHtmlElementByIdOrThrow } from './utils/getHtmlElementOrThrow';
import { VMath } from './VMath';
import { CameraController } from './entity/environment/CameraController';
import { LogMethod } from './utils/logger/LogMethod';
import { Level } from './utils/logger/Level';
import { GltfModelController } from './entity/models/GltfModelController';
import { ModelController } from './entity/models/ModelController';
import { FpsController } from './entity/hud/FpsController';
import { EntityName } from './engine/EntityName';
import { HtmlElementId } from './HtmlElementId';
import { CameraHudController } from './entity/hud/CameraHudController';
import { CharacterHudController } from './entity/hud/CharacterHudController';
import { LightController } from './entity/environment/LightController';

export class VoxelGame {
  private cloudColor = 0xaecfff;
  private lightAbsorptionMask = 0x000000;
  private darkEmissionLight = 0x000000;

  private renderer = new WebGLRenderer({
    antialias: true,
  });

  private gameEngine = new GameEngine();

  constructor() {
    this.initFactors();
    this.initSystems();

    this.configureThreeJs();

    this.initEnvironment();

    this.initClouds();
    this.initThrees();
    this.initUnits();
    this.initGui();

    this.subscribeRender();
  }

  private initFactors() {
    this.gameEngine.factors.create(SceneFactor);
    this.gameEngine.factors.create(GravityFactor);
    this.gameEngine.factors.create(SurfaceFactor)
      .generateSurface(1000, 5000);
  }

  private initSystems() {
    this.gameEngine.systems.create(TickSystem);
    this.gameEngine.systems.create(WindowEventSystem);
    this.gameEngine.systems.create(KeyboardEventSystem);
    this.gameEngine.systems.create(MouseEventSystem);
  }

  // TODO MOVE into some Entity i think
  private subscribeRender() {
    const tickSystem = this.gameEngine.systems.find(TickSystem);
    const cameraController = this.gameEngine.entities.get(EntityName.Environment).get<CameraController>(CameraController);

    tickSystem.on<number>(TickSystemEvent.Tick, event => {
      const scene = this.gameEngine.factors.find(SceneFactor).value;
      this.renderer.render(scene, cameraController.getCamera());
      // TODO change to Watching system
      this.gameEngine.update(event);
    })
  }

  private initEnvironment(): void {
    const environment = this.gameEngine.entities.create(Entity, EntityName.Environment);

    environment.create(CameraController);
    environment.create(LightController);
    environment.create(SurfaceController);
    environment.create(SkyController);

    this.gameEngine.entities.activate(environment);
  }

  @LogMethod({level: Level.info})
  private configureThreeJs() {
    const windowEventSystem = this.gameEngine.systems.find<WindowEventSystem>(WindowEventSystem);
    const window = windowEventSystem.getWindow();

    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.domElement.id = HtmlElementId.Scene;

    const container = getHtmlElementByIdOrThrow(HtmlElementId.Container);
    container.appendChild(this.renderer.domElement);

    windowEventSystem.on<WindowResizeEvent>(WindowTopic.Resize, event => {
      const window = event.view!;
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    })
  }

  @LogMethod({level: Level.info})
  private initClouds() {
    for (let i = 0; i < 25; ++i) {
      const index = VMath.rand_int(1, 3);
      const pos = new Vector3(
        (Math.random() * 2.0 - 1.0) * 500,
        250,
        (Math.random() * 2.0 - 1.0) * 500,
      );

      const cloudEntity = this.gameEngine.entities.create(Entity, `cloud_${i}`);
      cloudEntity.setProperty(PositionProperty, pos);
      cloudEntity.setProperty(RotationProperty, new Quaternion(0,0,0,1));

      const modelController = cloudEntity.create(StaticModelController);
      modelController.modelConfig = {
        resourcePath: './resources/clouds/',
        resourceName: 'Cloud' + index + '.glb',
        scale: Math.random() * 5 + 10,
        emissive: new Color(this.cloudColor),
        castShadow: true,
        receiveShadow: true,
      };

    }
  }

  @LogMethod({level: Level.info})
  private initThrees() {
    const surfaceFactor = this.gameEngine.factors.find(SurfaceFactor);
    const names = [
      'BirchTree',
      'BirchTree_Dead',
      'CommonTree',
      'CommonTree_Dead',
      'PineTree',
      'Willow',
      'Willow_Dead',
    ];
    for (let i = 0; i < 100; ++i) {
      const name = names[VMath.rand_int(0, names.length - 1)];
      const index = VMath.rand_int(1, 5);
      const x = (Math.random() * 2.0 - 1.0) * 500;
      const z = (Math.random() * 2.0 - 1.0) * 500;
      const y = surfaceFactor.getZCord(x,z);

      const pos = new Vector3(x,y,z);

      const tree = this.gameEngine.entities.create(Entity, `tree_${i}`);
      tree.setProperty(PositionProperty, pos);
      tree.setProperty(RotationProperty, new Quaternion(0,0,0,1));

      tree.create(SpatialGridController);
      const modelController = tree.create(StaticModelController);
      modelController.modelConfig = {
        resourcePath: './resources/trees/',
        resourceName: name + '_' + index + '.fbx',
        scale: 0.25,
        emissive: new Color(this.darkEmissionLight),
        specular: new Color(this.lightAbsorptionMask),
        receiveShadow: true,
        castShadow: true,
      };

    }
  }

  @LogMethod({level: Level.info})
  private initUnits() {
    this.initPlayer();
    this.initNPC();
    this.initEnemies();
    this.initQuestPlaces();
    this.initItems();
  }

  @LogMethod({level: Level.info})
  private initPlayer() {
    const player = this.gameEngine.entities.create(Entity, EntityName.Player);
    const modelController = player.create(GltfModelController, ModelController);
    const stateController = player.create(StateController);

    player.create(KeyboardActivityController);
    player.create(GravityAccelerationController);
    player.create(ActivityAccelerationController);
    player.create(ActivityDecelerationController);
    player.create(ActivityRotationController);
    player.create(VelocityController);
    player.create(DynamicPositionController).setNearest(0,0);
    player.create(SpatialGridController);

    modelController.modelConfig = {
      resourcePath: './resources/units/',
      resourceModel: 'guard.glb',
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
    this.gameEngine.entities.activate(player);
    this.focusEnvironmentOn(player);
  }

  // TODO convert code to one time action or send responsibility in controller.
  private focusEnvironmentOn(target: Entity) {
    const environment = this.gameEngine.entities.get(EntityName.Environment);
    environment.get<CameraController>(CameraController).setTarget(target);
    environment.get<LightController>(LightController).setTarget(target);
    environment.get<SkyController>(SkyController).setTarget(target);
  }

  @LogMethod({level: Level.info})
  private initNPC() {
    // TODO create when dynamic objects could be created
  }

  @LogMethod({level: Level.info})
  private initEnemies() {
    // TODO create when dynamic objects could be created
  }

  @LogMethod({level: Level.info})
  private initQuestPlaces() {
    // TODO create when dynamic objects could be created
  }

  @LogMethod({level: Level.info})
  private initItems() {
    // TODO create when dynamic objects could be created
  }

  @LogMethod({level: Level.info})
  private initGui() {
    const gui = this.gameEngine.entities.create(Entity);

    gui.create(FpsController);
    gui.create(CameraHudController);
    gui.create(CharacterHudController);
    this.gameEngine.entities.activate(gui);
  }
}
