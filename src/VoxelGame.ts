import { TickSystem, TickSystemEvent } from 'src/system/TickSystem';
import {
  WebGLRenderer,
  Scene,
  Color,
  FogExp2,
  DirectionalLight,
  Mesh,
  HemisphereLight,
  Object3D,
  SphereGeometry,
  ShaderMaterial,
  BackSide,
  Vector3,
} from 'three';
import { SRGBColorSpace, PCFSoftShadowMap } from 'three/src/constants';
import { Entity } from './entity/commons/Entity';
import { GameEngine } from './entity/commons/GameEngine';
import { getVisualEntityOrThrow } from './entity/commons/utils/getVisualEntityOrThrow';
import { SurfaceController } from './entity/environment/SurfaceController';
import { StaticModelController, StaticModelConfig } from './entity/models/StaticModelController';
import { GravityFactor } from './factor/GravityFactor';
import { SurfaceFactor } from './factor/surface/SurfaceFactor';
import { SpatialGridController } from './grid/SpatialGridController';
import skyFragment from './resources/sky.fs';
import skyVertex from './resources/sky.vs';
import { WindowEventSystem, WindowEvent } from './system/WindowEventSystem';
import { getHtmlElementByIdOrThrow } from './utils/getHtmlElementOrThrow';
import { VMath } from './VMath';
import { CameraController } from './entity/environment/CameraController';
import { UserCharacterController } from './entity/user/UserCharacterController';
import { LogMethod } from './utils/logger/LogMethod';
import { Level } from './utils/logger/Level';
import { GltfModelController, GltfModelConfig } from './entity/models/GltfModelController';
import { ModelController } from './entity/models/ModelController';
import { VisualEntity } from './entity/commons/VisualEntity';
import { FpsController } from './entity/hud/FpsController';
import { EntityName } from './entity/commons/EntityName';
import { HtmlElementId } from './HtmlElementId';
import { CameraHudController } from './entity/hud/CameraHudController';
import { CharacterHudController } from './entity/hud/CharacterHudController';
import { LightController } from './entity/environment/LightController';

const initialPlayerPositionX = 25;
const initialPlayerPositionY = 10;
const initialPlayerPositionZ = 0;

export class VoxelGame {
  private fogColor = 0x6982ab;
  private backgroundColor = 0xeeffff;
  private lightColor = 0xeeffff;
  private skyColor = 0x3385FF;
  private cloudColor = 0xaecfff;
  private lightAbsorptionMask = 0x000000;
  private darkEmissionLight = 0x000000;

  private surfaceSize = 5000;
  private mapSize = 1000;

  private threeJs = new WebGLRenderer({
    antialias: true,
  });

  private scene = this.createScene();
  private sun = this.createLightning();

  private gameEngine = new GameEngine();

  constructor() {
    this.initFactors();
    this.initSystems();

    this.configureThreeJs();

    this.initEnvironment();
    this.buildSky();
    this.initClouds();
    this.initThrees();
    this.initUnits();
    this.initGui();

    this.subscribeRender();
  }

  private initFactors() {
    this.gameEngine.factors.create(GravityFactor);
    this.gameEngine.factors.create(SurfaceFactor)
      .generateSurface(this.mapSize, this.surfaceSize);
  }

  private initSystems() {
    this.gameEngine.systems.create(TickSystem);
    this.gameEngine.systems.create(WindowEventSystem);
  }

  // TODO MOVE into some Entity i think
  private subscribeRender() {
    const tickSystem = this.gameEngine.systems.findOne(TickSystem);
    const cameraController = this.gameEngine.entities.get(EntityName.Environment).get<CameraController>(CameraController);

    tickSystem.on<number>(TickSystemEvent.Tick, event =>{
      this.threeJs.render(this.scene, cameraController.getCamera());
      // TODO change to Watching system
      this.gameEngine.update(event);
    })
  }

  private initEnvironment(): void {
    const windowEventSystem = this.gameEngine.systems.findOne<WindowEventSystem>(WindowEventSystem);

    const environment = this.gameEngine.entities.create(VisualEntity, EntityName.Environment);

    environment.add(new CameraController(windowEventSystem, this.gameEngine, environment, CameraController.name));
    environment.add(new LightController(this.sun, this.gameEngine, environment, LightController.name));
    environment.add(new SurfaceController(this.scene, this.gameEngine, environment, SurfaceController.name));

    this.gameEngine.entities.activate(environment);

    this.putIntoScene(this.sun);
    this.putIntoScene(this.sun.target);
    this.initSurface();
  }
  private initSurface() {
    // TODO think about surface
  }

  @LogMethod({level: Level.info})
  private configureThreeJs() {
    const windowEventSystem = this.gameEngine.systems.findOne<WindowEventSystem>(WindowEventSystem);
    const window = windowEventSystem.getWindow();

    this.threeJs.outputColorSpace = SRGBColorSpace;
    this.threeJs.shadowMap.enabled = true;
    this.threeJs.shadowMap.type = PCFSoftShadowMap;
    this.threeJs.setPixelRatio(window.devicePixelRatio);
    this.threeJs.setSize(window.innerWidth, window.innerHeight);
    this.threeJs.domElement.id = HtmlElementId.Scene;

    const container = getHtmlElementByIdOrThrow(HtmlElementId.Container);
    container.appendChild(this.threeJs.domElement);


    windowEventSystem.on<UIEvent>(WindowEvent.Resize, event => {
      const window = event.view!;
      this.threeJs.setPixelRatio(window.devicePixelRatio);
      this.threeJs.setSize(window.innerWidth, window.innerHeight);
    })
  }

  @LogMethod({level: Level.info})
  private createScene(): Scene {
    const scene = new Scene();
    scene.background = new Color(this.backgroundColor);
    scene.fog = new FogExp2(this.fogColor, 0.002);

    return scene;
  }

  @LogMethod({level: Level.info})
  private createLightning(): DirectionalLight {
    const light = new DirectionalLight(this.lightColor, 1.0);
    light.position.set(0, 800, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 4096;
    light.shadow.mapSize.height = 4096;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 1000.0;
    light.shadow.camera.left = 150;
    light.shadow.camera.right = -150;
    light.shadow.camera.top = 150;
    light.shadow.camera.bottom = -150;
    light.shadow.radius = 5;
    light.shadow.blurSamples = 25;

    return light;
  }

  private createHelioSphere(): HemisphereLight {
    const helioSphere = new HemisphereLight(this.skyColor, this.backgroundColor, 0.6);
    helioSphere.color.setHex(this.skyColor);
    helioSphere.groundColor.setHex(this.backgroundColor);

    return helioSphere;
  }

  private putIntoScene(...objects: Object3D[]) {
    this.scene.add(...objects);
  }

  @LogMethod({level: Level.info})
  private buildSky() {
    const helio = this.createHelioSphere();
    this.putIntoScene(helio);
    this.putIntoScene(this.createSkyMesh(helio));
  }

  private createSkyMesh(helio: HemisphereLight): Mesh {
    const skyGeo = new SphereGeometry(2000, 32, 32);
    const skyMat = new ShaderMaterial({
      uniforms: {
        topColor: {value: helio.color},
        bottomColor: {value: helio.groundColor},
        offset: {value: 33},
        exponent: {value: 0.6},
      },
      vertexShader: skyVertex,
      fragmentShader: skyFragment,
      side: BackSide,
    });

    return new Mesh(skyGeo, skyMat);
  }

  @LogMethod({level: Level.info})
  private initClouds() {
    for (let i = 0; i < 25; ++i) {
      const index = VMath.rand_int(1, 3);
      const pos = new Vector3(
        (Math.random() * 2.0 - 1.0) * 500,
        250,
        (Math.random() * 2.0 - 1.0) * 500);

      const cloudEntity = this.gameEngine.entities.create(VisualEntity, `cloud_${i}`);
      const staticModelConfig: StaticModelConfig = {
          scene: this.scene,
          resourcePath: './resources/clouds/',
          resourceName: 'Cloud' + index + '.glb',
          scale: Math.random() * 5 + 10,
          emissive: new Color(this.cloudColor),
          castShadow: true,
          receiveShadow: true,
      };

      cloudEntity.add(
        new StaticModelController(staticModelConfig, this.gameEngine, cloudEntity, StaticModelController.name),
        ModelController,
      );
      cloudEntity.setPosition(pos);
    }
  }

  @LogMethod({level: Level.info})
  private initThrees() {
    const surfaceFactor = this.gameEngine.factors.findOne(SurfaceFactor);
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

      const tree = this.gameEngine.entities.create(VisualEntity, `tree_${i}`);
      const staticModelConfig: StaticModelConfig = {
          scene: this.scene,
          resourcePath: './resources/trees/',
          resourceName: name + '_' + index + '.fbx',
          scale: 0.25,
          emissive: new Color(this.darkEmissionLight),
          specular: new Color(this.lightAbsorptionMask),
          receiveShadow: true,
          castShadow: true,
      };

      tree.add(
        new StaticModelController(staticModelConfig, this.gameEngine, tree, StaticModelController.name),
        ModelController,
      );
      tree.add(new SpatialGridController(this.gameEngine, tree, SpatialGridController.name));
      tree.setPosition(pos);
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
    const player = this.gameEngine.entities.create(VisualEntity, EntityName.Player);
    const gltfModelConfig: GltfModelConfig = {
        scene: this.scene,
        resourcePath: './resources/units/',
        resourceModel: 'guard.glb',
        scale: 15,
        receiveShadow: true,
        castShadow: true,
    };
    player.add(
      new GltfModelController(gltfModelConfig, this.gameEngine, player, GltfModelController.name),
      ModelController,
    );
    player.add(new UserCharacterController(this.gameEngine, player, UserCharacterController.name));
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
    player.add(new SpatialGridController(this.gameEngine, player, SpatialGridController.name));
    // TODO make position height (y) by surface position
    const pos = new Vector3(
      initialPlayerPositionX,
      initialPlayerPositionY,
      initialPlayerPositionZ,
    );
    player.setPosition(pos);
    this.gameEngine.entities.activate(player);
    this.focusEnvironmentOn(EntityName.Player);
  }

  private focusEnvironmentOn(entityName: string) {
    const target = getVisualEntityOrThrow(this, this.gameEngine.entities.get(entityName));
    const environment = getVisualEntityOrThrow(this, this.gameEngine.entities.get(EntityName.Environment));
    const camera = environment?.get<CameraController>(CameraController);
    const light = environment?.get<LightController>(LightController);

    if (!camera) {
      console.warn(EntityName.Environment, environment, CameraController.name, camera);
      throw new Error(`No camera detected for focus on object`);
    }

    if (!light) {
      console.warn(EntityName.Environment, environment, LightController.name, light);
      throw new Error(`No light detected for focus on object`);
    }

    camera.setTarget(target);
    light.setTarget(target);
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
    const gui = this.gameEngine.entities.create(Entity, EntityName.Gui);

    gui.add(new FpsController(this.gameEngine, gui, FpsController.name));
    gui.add(new CameraHudController(this.gameEngine, gui, CameraHudController.name));
    gui.add(new CharacterHudController(this.gameEngine, gui, CharacterHudController.name));
    this.gameEngine.entities.activate(gui);
  }
}
