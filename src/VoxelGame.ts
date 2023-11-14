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
import { StaticModelController } from './entity/models/StaticModelController';
import { SpatialGridController } from './grid/SpatialGridController';
import { WindowEventObserver } from './observers/WindowEventObserver';
import { WindowTopic } from './observers/WindowTopic';
import skyFragment from './resources/sky.fs';
import skyVertex from './resources/sky.vs';
import { getHtmlElementByIdOrThrow } from './utils/getHtmlElementOrThrow';
import { VMath } from './VMath';
import { CameraController } from './entity/environment/CameraController';
import { UserCharacterController } from './entity/user/UserCharacterController';
import { LogMethod } from './utils/logger/LogMethod';
import { Level } from './utils/logger/Level';
import { GltfModelController } from './entity/models/GltfModelController';
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
  private windowObserver = new WindowEventObserver();

  private surfaceController = new SurfaceController(this.scene, this.mapSize, this.surfaceSize);
  private cameraController = new CameraController(this.windowObserver);

  constructor() {
    this.initialize();
  }

  @LogMethod({level: Level.info})
  private initialize() {
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

  private initSystems() {
    this.gameEngine.systems.create(TickSystem);
  }

  // TODO MOVE into some Entity i think
  private subscribeRender() {
    const tickSystem = this.gameEngine.systems.findOne(TickSystem);
    tickSystem.on<number>(TickSystemEvent.Tick, event =>{
      this.threeJs.render(this.scene, this.cameraController.getCamera());
      // TODO change to Watching system
      this.gameEngine.update(event);
    })
  }

  private initEnvironment(): void {
    const environment = this.gameEngine.entities.create(VisualEntity, EntityName.Environment);
    environment.add(this.cameraController);
    environment.add(new LightController(this.sun));
    environment.add(this.surfaceController);

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
    const window = this.windowObserver.getWindow();

    this.threeJs.outputColorSpace = SRGBColorSpace;
    this.threeJs.shadowMap.enabled = true;
    this.threeJs.shadowMap.type = PCFSoftShadowMap;
    this.threeJs.setPixelRatio(window.devicePixelRatio);
    this.threeJs.setSize(window.innerWidth, window.innerHeight);
    this.threeJs.domElement.id = HtmlElementId.Scene;

    const container = getHtmlElementByIdOrThrow(HtmlElementId.Container);
    container.appendChild(this.threeJs.domElement);


    this.windowObserver.on<UIEvent>(WindowTopic.Resize, event => {
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

      cloudEntity.add(
        new StaticModelController({
          scene: this.scene,
          resourcePath: './resources/clouds/',
          resourceName: 'Cloud' + index + '.glb',
          scale: Math.random() * 5 + 10,
          emissive: new Color(this.cloudColor),
          castShadow: true,
          receiveShadow: true,
        }),
        ModelController,
      );
      cloudEntity.setPosition(pos);
    }
  }

  @LogMethod({level: Level.info})
  private initThrees() {
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
      const y = this.surfaceController.getZCord(x,z);

      const pos = new Vector3(x,y,z);

      const tree = this.gameEngine.entities.create(VisualEntity, `tree_${i}`);

      tree.add(
        new StaticModelController({
          scene: this.scene,
          resourcePath: './resources/trees/',
          resourceName: name + '_' + index + '.fbx',
          scale: 0.25,
          emissive: new Color(this.darkEmissionLight),
          specular: new Color(this.lightAbsorptionMask),
          receiveShadow: true,
          castShadow: true,
        }),
        ModelController,
      );
      tree.add(new SpatialGridController(this.surfaceController));
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
    player.add(
      new GltfModelController({
        scene: this.scene,
        resourcePath: './resources/units/',
        resourceModel: 'guard.glb',
        scale: 15,
        receiveShadow: true,
        castShadow: true,
      }),
      ModelController,
    );
    player.add(new UserCharacterController());
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
    player.add(new SpatialGridController(this.surfaceController));
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

    gui.add(new FpsController());
    gui.add(new CameraHudController());
    gui.add(new CharacterHudController());
    this.gameEngine.entities.activate(gui);
  }
}
