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
  Object3D, SphereGeometry, ShaderMaterial, BackSide, IUniform,
} from 'three';
import { SRGBColorSpace, PCFSoftShadowMap } from 'three/src/constants';
import * as skyVertex from './resources/sky.vert';
import * as skyFragment from './resources/sky.frag';

export class VoxelGame {
  static containerId = 'container';
  static sceneId = 'threeJs';
  private threeJs = new WebGLRenderer({
    antialias: true,
  });
  private camera!: PerspectiveCamera;
  private scene!: Scene;
  private sun!: DirectionalLight;
  private surface!: Mesh;

  constructor() {
    this.initialize();
  }

  private initialize() {
    this.configureThreeJs();
    this.addWindowSizeWatcher();
    this.scene = this.createScene();
    this.camera = this.createCamera();
    this.sun = this.createLightning();
    this.putIntoScene(this.sun);
    this.surface = this.createSurface();
    this.putIntoScene(this.surface);
    this.buildSky();
    this.initClouds();
    this.initThrees();
    this.initUnits();
  }

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

  private createCamera(): PerspectiveCamera {
    const fov = 60;
    const aspect = 1920 / 1080;
    const near = 1.0;
    const far = 10000.0;
    const camera = new PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(25, 10, 25);

    return camera;
  }

  private configureThreeJs() {
    this.threeJs.outputColorSpace = SRGBColorSpace;
    this.threeJs.shadowMap.enabled = true;
    this.threeJs.shadowMap.type = PCFSoftShadowMap;
    this.threeJs.setPixelRatio(window.devicePixelRatio);
    this.threeJs.setSize(window.innerWidth, window.innerHeight);
    this.threeJs.domElement.id = VoxelGame.sceneId;
  }

  private createScene(): Scene {
    const scene = new Scene();
    scene.background = new Color(0xFFFFFF);
    scene.fog = new FogExp2(0x89b2eb, 0.002);

    return scene;
  }

  private createLightning(): DirectionalLight {
    let light = new DirectionalLight(0xFFFFFF, 1.0);
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
    uniforms['topColor'].value.copy(helio.color);

    this.scene.fog?.color.copy(uniforms['bottomColor'].value)
    this.putIntoScene(this.createSkyMesh(uniforms));
  }

  private initClouds() {
    // TODO create when static objects could be created
  }

  private initThrees() {
    // TODO create when static objects could be created
  }

  private initUnits() {
    this.initNPC();
    this.initEnemies();
    this.initQuestPlaces();
    this.initItems();
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
}
