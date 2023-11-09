import {
  PerspectiveCamera,
  WebGLRenderer,
  Scene,
  Color,
  FogExp2,
  DirectionalLight,
  Mesh,
  PlaneGeometry,
  MeshStandardMaterial,
  HemisphereLight,
  Object3D,
  SphereGeometry,
  ShaderMaterial,
  BackSide,
  IUniform,
  Vector3,
} from 'three';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry';
import { SRGBColorSpace, PCFSoftShadowMap } from 'three/src/constants';
import { Entity } from './entity/commons/Entity';
import { EntityManager } from './entity/commons/EntityManager';
import { StaticModelController } from './entity/models/StaticModelController';
import { SpatialGridController } from './grid/SpatialGridController';
import { SpatialHashGrid } from './grid/SpatialHashGrid';
import skyFragment from './resources/sky.fs';
import skyVertex from './resources/sky.vs';
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
  private fogColor = 0x89b2eb;
  private backgroundColor = 0x999999;
  private lightColor = 0xeeffff;
  private groundColor = 0x1e601c;
  private hellColor = 0xFFC880;
  private skyColor = 0x3385FF;
  private cloudColor = 0xc0a080;
  private lightAbsorptionMask = 0x000000;
  private darkEmissionLight = 0x000000;

  private mapSize = 5000;
  private mapScale = 2;
  private threeJs = new WebGLRenderer({
    antialias: true,
  });
  private entityManager = new EntityManager();
  private camera = this.createCamera();
  private scene = this.createScene();
  private sun = this.createLightning();
  private surface = this.createSurface();
  private grid = new SpatialHashGrid([[-this.mapSize/2, -this.mapSize/2], [this.mapSize/2, this.mapSize/2]], [100, 100]);
  private prevTick: number | undefined;

  constructor() {
    this.initialize();
  }

  @LogMethod({level: Level.info})
  private initialize() {
    this.configureThreeJs();
    this.addWindowSizeWatcher();

    this.initEnvironment();
    this.buildSky();
    this.initClouds();
    this.initThrees();
    this.initUnits();
    this.initHud();
    this.requestAnimation();
  }

  @LogMethod({level: Level.info})
  private addWindowSizeWatcher() {
    const container = document.getElementById(HtmlElementId.Container);

    if (!container) {
      throw new Error(`Can't find DOM Element with id='${HtmlElementId.Container}'`);
    }

    container.appendChild(this.threeJs.domElement);

    window.addEventListener('resize', () => {
      this.onWindowResize();
    }, false);
  }

  private onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.threeJs.setSize(window.innerWidth, window.innerHeight);
  }

  @LogMethod({level: Level.info})
  private createCamera(): PerspectiveCamera {
    const fov = 60;
    const aspect = 1920 / 1080;
    const near = 1.0;
    const far = 10000.0;
    const camera = new PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(
      initialPlayerPositionX,
      initialPlayerPositionY,
      initialPlayerPositionX + 25);

    return camera;
  }

  private initEnvironment(): void {
    const environment = new VisualEntity();
    environment.AddComponent(new CameraController(this.camera));
    environment.AddComponent(new LightController(this.sun));
    this.entityManager.add(environment, EntityName.Environment);

    this.putIntoScene(this.sun);
    this.putIntoScene(this.sun.target);
    this.putIntoScene(this.surface);
  }

  @LogMethod({level: Level.info})
  private configureThreeJs() {
    this.threeJs.outputColorSpace = SRGBColorSpace;
    this.threeJs.shadowMap.enabled = true;
    this.threeJs.shadowMap.type = PCFSoftShadowMap;
    this.threeJs.setPixelRatio(window.devicePixelRatio);
    this.threeJs.setSize(window.innerWidth, window.innerHeight);
    this.threeJs.domElement.id = HtmlElementId.Scene;
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
    light.position.set(-10, 500, 10);
    light.target.position.set(0, 0, 0);
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

    return light;
  }

  @LogMethod({level: Level.info})
  private createSurface(): Mesh {
//    const geometry = new PlaneGeometry(this.mapSize, this.mapSize, this.mapSize/this.mapScale, this.mapSize/this.mapScale);

    const scale = 5;
    const calculatePoint = (percentX: number, percentY: number, target: Vector3): void => {
      const x = Math.floor(percentX*(this.mapSize-1) - this.mapSize/2);
      const y = Math.floor(percentY*(this.mapSize-1) - this.mapSize/2);
      const z = Math.random() * 2 - 1;
      target.set(x,y,z);
    }
    const geometry = new ParametricGeometry(calculatePoint, this.mapSize/scale, this.mapSize/scale);
    const surface = new Mesh(
      geometry,
      new MeshStandardMaterial({
        color: this.groundColor,
        wireframe: true,
        wireframeLinewidth: 4,
      }));

    surface.castShadow = false;
    surface.receiveShadow = true;
    surface.rotation.x = - Math.PI / 2;

    return surface;
  }

  private createHelioSphere(): HemisphereLight {
    const helioSphere = new HemisphereLight(this.lightColor, this.lightColor, 0.6);
    helioSphere.color.setHex(this.skyColor);
    helioSphere.groundColor.setHex(this.hellColor);

    return helioSphere;
  }

  private putIntoScene(...objects: Object3D[]) {
    this.scene.add(...objects);
  }

  @LogMethod({level: Level.info})
  private buildSky() {
    const helio = this.createHelioSphere();
    this.putIntoScene(helio);
//    this.scene.fog?.color.copy((uniforms.bottomColor.value as Color));
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
        100,
        (Math.random() * 2.0 - 1.0) * 500);

      const cloudEntity = new VisualEntity();
      cloudEntity.AddComponent(
        new StaticModelController({
          scene: this.scene,
          resourcePath: './resources/clouds/',
          resourceName: 'Cloud' + index + '.glb',
          scale: Math.random() * 5 + 10,
          emissive: new Color(this.cloudColor),
        }),
        ModelController,
      );
      cloudEntity.setPosition(pos);
      this.entityManager.add(cloudEntity);
      cloudEntity.disactivate();
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

      const pos = new Vector3(
        (Math.random() * 2.0 - 1.0) * 500,
        0,
        (Math.random() * 2.0 - 1.0) * 500);

      const tree = new VisualEntity();
      tree.AddComponent(
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
      tree.AddComponent(new SpatialGridController(this.grid));
      tree.setPosition(pos);
      this.entityManager.add(tree);
      tree.disactivate();
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
    const player = new VisualEntity();
    player.AddComponent(
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
    player.AddComponent(new UserCharacterController());
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
    player.AddComponent(new SpatialGridController(this.grid));
    const pos = new Vector3(
      initialPlayerPositionX,
      initialPlayerPositionY,
      initialPlayerPositionZ,
    );
    player.setPosition(pos);
    this.entityManager.add(player, EntityName.Player);
    this.focusEnvironmentOn(EntityName.Player);
  }

  private focusEnvironmentOn(entityName: string) {
    const target = this.entityManager.get<VisualEntity>(entityName);
    const environment = this.entityManager.get<VisualEntity>(EntityName.Environment);
    const camera = environment?.getComponent<CameraController>(CameraController);
    const light = environment?.getComponent<LightController>(LightController);

    if (!target) {
      console.warn(entityName, VisualEntity.name, target);
      throw new Error(`No target object detected for focus on object`);
    }

    if (!camera) {
      console.warn(EntityName.Environment, environment, CameraController.name, camera);
      throw new Error(`No camera detected for focus on object`);
    }

    if (!light) {
      console.warn(EntityName.Environment, environment, LightController.name, light);
      throw new Error(`No light detected for focus on object`);
    }

    camera.focusCameraOn(target);
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
  private initHud() {
    const hud = new Entity();
    hud.AddComponent(new FpsController());
    hud.AddComponent(new CameraHudController());
    hud.AddComponent(new CharacterHudController());
    this.entityManager.add(hud);
  }

  private requestAnimation() {
    requestAnimationFrame((t) => {
      if (!this.prevTick) {
        this.prevTick = t;
      }

      const deltaTime = t - this.prevTick;

      this.requestControllerUpdate(deltaTime);
      this.threeJs.render(this.scene, this.camera);

      this.prevTick = t;

      this.requestAnimation();
    });
  }

  private requestControllerUpdate(deltaTime: number) {
    this.entityManager.update(deltaTime);
  }
}
