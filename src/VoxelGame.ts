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
  IUniform, Vector3,
} from 'three';
import { SRGBColorSpace, PCFSoftShadowMap } from 'three/src/constants';
import { Entity } from './entity/commons/Entity';
import { EntityManager } from './entity/commons/EntityManager';
import { StaticModelComponent } from './entity/models/StaticModelComponent';
import { SpatialGridController } from './grid/SpatialGridController';
import { SpatialHashGrid } from './grid/SpatialHashGrid';
import skyFragment from './resources/sky.fs';
import skyVertex from './resources/sky.vs';
import { VMath } from './VMath';
import {ThirdPersonCamera} from "./entity/ThirdPersonCamera";
// import {CustomizableModelComponent, CustomizableModelConfig} from "./entity/models/CustomizableModelComponent";
import {UserCharacterController} from "./entity/user/UserCharacterController";
import {LogMethod} from "./utils/logger/LogMethod";
import {Level} from "./utils/logger/Level";
import {GltfModelComponent} from "./entity/models/GltfModelComponent";
import {ModelComponent} from "./entity/models/ModelComponent";

const initialPlayerPositionX = 25;
const initialPlayerPositionY = 10;
const initialPlayerPositionZ = 0;

export class VoxelGame {
  static containerId = 'container';
  static sceneId = 'threeJs';
  static fpsId = 'fps';
  static playerEntityName = 'player';
  static cameraEntityName = 'camera';
  private threeJs = new WebGLRenderer({
    antialias: true,
  });
  private entityManager = new EntityManager();
  private camera!: PerspectiveCamera;
  private scene!: Scene;
  private sun!: DirectionalLight;
  private surface!: Mesh;
  private prevTick: number | undefined;
  private tickFrames: number[] = [];
  private grid = new SpatialHashGrid([[-1000, -1000], [1000, 1000]], [100, 100]);

  constructor() {
    this.initialize();
  }

  @LogMethod({level: Level.info})
  private initialize() {
    this.configureThreeJs();
    this.addWindowSizeWatcher();
    this.scene = this.createScene();
    this.camera = this.createCamera();
    this.initCamera();
    this.sun = this.createLightning();
    this.putIntoScene(this.sun);
    this.surface = this.createSurface();
    this.putIntoScene(this.surface);
    this.buildSky();
    this.initClouds();
    this.initThrees();
    this.initUnits();
    this.requestAnimation();
  }

  @LogMethod({level: Level.info})
  private addWindowSizeWatcher() {
    const container = document.getElementById(VoxelGame.containerId);

    if (!container) {
      throw new Error(`Can't find DOM Element with id='${VoxelGame.containerId}'`);
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

  private initCamera(): void {
    const camera = new Entity();
    camera.AddComponent(new ThirdPersonCamera(this.camera));
    this.entityManager.add(camera, VoxelGame.cameraEntityName);
  }

  @LogMethod({level: Level.info})
  private configureThreeJs() {
    this.threeJs.outputColorSpace = SRGBColorSpace;
    this.threeJs.shadowMap.enabled = true;
    this.threeJs.shadowMap.type = PCFSoftShadowMap;
    this.threeJs.setPixelRatio(window.devicePixelRatio);
    this.threeJs.setSize(window.innerWidth, window.innerHeight);
    this.threeJs.domElement.id = VoxelGame.sceneId;
  }

  @LogMethod({level: Level.info})
  private createScene(): Scene {
    const scene = new Scene();
    scene.background = new Color(0xFFFFFF);
    scene.fog = new FogExp2(0x89b2eb, 0.002);

    return scene;
  }

  @LogMethod({level: Level.info})
  private createLightning(): DirectionalLight {
    const light = new DirectionalLight(0xFFFFFF, 1.0);
    light.position.set(-10, 500, 10);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 4096;
    light.shadow.mapSize.height = 4096;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 1000.0;
    light.shadow.camera.left = 100;
    light.shadow.camera.right = -100;
    light.shadow.camera.top = 100;
    light.shadow.camera.bottom = -100;

    return light;
  }

  @LogMethod({level: Level.info})
  private createSurface(): Mesh {
    const surface = new Mesh(
      new PlaneGeometry(5000, 5000, 10, 10),
      new MeshStandardMaterial({
        color: 0x1e601c,
      }));

    surface.castShadow = false;
    surface.receiveShadow = true;
    surface.rotation.x = -Math.PI / 2;

    return surface;
  }

  private createHelioSphere(): HemisphereLight {
    const helioSphere = new HemisphereLight(0xFFFFFF, 0xFFFFFFF, 0.6);
    helioSphere.color.setHSL(0.6, 1, 0.6);
    helioSphere.groundColor.setHSL(0.095, 1, 0.75);

    return helioSphere;
  }

  private putIntoScene(...objects: Object3D[]) {
    this.scene.add(...objects);
  }

  private createSkyMesh(uniforms: Record<string, IUniform>): Mesh {
    const skyGeo = new SphereGeometry(1000, 32, 15);
    const skyMat = new ShaderMaterial({
      uniforms: uniforms,
      vertexShader: skyVertex,
      fragmentShader: skyFragment,
      side: BackSide,
    });

    return new Mesh(skyGeo, skyMat);
  }

  @LogMethod({level: Level.info})
  private buildSky() {
    const helio = this.createHelioSphere();
    this.putIntoScene(helio);
    // TODO Make uniform more strict and typed
    const uniforms: Record<string, IUniform> = {
      topColor: {value: new Color(0x0077ff)},
      bottomColor: {value: new Color(0xffffff)},
      offset: {value: 33},
      exponent: {value: 0.6},
    };
    (uniforms.topColor.value as Color).copy(helio.color);

    this.scene.fog?.color.copy((uniforms.bottomColor.value as Color))
    this.putIntoScene(this.createSkyMesh(uniforms));
  }

  @LogMethod({level: Level.info})
  private initClouds() {
    for (let i = 0; i < 25; ++i) {
      const index = VMath.rand_int(1, 3);
      const pos = new Vector3(
          (Math.random() * 2.0 - 1.0) * 500,
          100,
          (Math.random() * 2.0 - 1.0) * 500);

      const cloudEntity = new Entity();
      cloudEntity.AddComponent(new StaticModelComponent({
        scene: this.scene,
        resourcePath: './resources/clouds/',
        resourceName: 'Cloud' + index + '.glb',
        scale: Math.random() * 5 + 10,
        emissive: new Color(0x808080),
      }));
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

      const e = new Entity();
      e.AddComponent(new StaticModelComponent({
        scene: this.scene,
        resourcePath: './resources/trees/',
        resourceName: name + '_' + index + '.fbx',
        scale: 0.25,
        emissive: new Color(0x000000),
        specular: new Color(0x000000),
        receiveShadow: true,
        castShadow: true,
      }));
      e.AddComponent(new SpatialGridController(this.grid));
      e.setPosition(pos);
      this.entityManager.add(e);
      e.disactivate();
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
    const player = new Entity();
    player.AddComponent(
      new GltfModelComponent({
        scene: this.scene,
        resourcePath: './resources/units/',
        resourceModel: 'guard.glb',
        scale: 15,
        receiveShadow: true,
        castShadow: true,
      }),
      ModelComponent,
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
      initialPlayerPositionZ
    );
    player.setPosition(pos);
    this.entityManager.add(player, VoxelGame.playerEntityName);
    this.focusCameraOn(VoxelGame.playerEntityName)
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

  private focusCameraOn(entityName: string) {
    const target = this.entityManager.get(entityName);
    const cameraEntity = this.entityManager.get(VoxelGame.cameraEntityName);
    const camera = cameraEntity?.getComponent(ThirdPersonCamera);

    if (!camera) {
      console.error(VoxelGame.cameraEntityName, cameraEntity, ThirdPersonCamera.constructor.name, camera);
      throw new Error(`No camera detected for focus on object`);
    }

    camera.target = target;
  }

  private requestAnimation() {
    requestAnimationFrame((t) => {
      if (this.prevTick === null) {
        this.prevTick = t;
      }

      this.requestAnimation();

      this.threeJs.render(this.scene, this.camera);
      this.updateTick(t, t - this.prevTick!);
      this.prevTick = t;
    });
  }

  private updateTick(_: number, tickTime: number) {
    if (this.tickFrames.length >= 1000) {
      this.tickFrames = this.tickFrames.slice(this.tickFrames.length - 200);
    }

    this.tickFrames.push(tickTime);
    const fpsWrapper = document.getElementById(VoxelGame.fpsId);
    const sectionTicks = this.tickFrames.slice(this.tickFrames.length - 200);
    if (fpsWrapper) {
      fpsWrapper.innerText = Math.floor(1000 * sectionTicks.length / sectionTicks.reduce((a, b) => a + b, 0)).toString();
    }
  }
}
