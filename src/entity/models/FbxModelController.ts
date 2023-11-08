import {
  Vector3,
  Scene,
  Color,
  AnimationClip,
  TextureLoader,
  sRGBEncoding,
  Texture,
  Material,
  AnimationMixer,
  Object3D,
  Mesh,
  LoadingManager,
} from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { MeshPhongMaterial } from 'three/src/materials/MeshPhongMaterial';
import { EmittedEvent } from '../commons/emitter/EmittedEvent';
import { ModelController } from './ModelController';

export interface CustomizableModelConfig {
  resourcePath: string;
  resourceModel: string;
  resourceAnimations: Record<string, string>;
  scene: Scene;
  scale: number;
  resourceTexture?: string;
  specular?: Color;
  emissive?: Color;
  receiveShadow?: boolean;
  castShadow?: boolean;
  visible?: boolean;
}

export class FbxModelController extends ModelController {
  private boundOnPositionChange = this.onPositionChange.bind(this);
  private texture: Texture | undefined;

  constructor(
    private params: CustomizableModelConfig,
  ) {
    super();
    this.loadResources();
  }

  onEntityChange() {
    if (!this.entity) {
      console.log(this);
      throw new Error(`Can't find entity in ${this.constructor.name}`);
    }

    this.entity.on('update.position', this.boundOnPositionChange);
  }

  onPositionChange(m: EmittedEvent<Vector3>) {
    if (this.model) {
      this.model.position.copy(m.value);
      this.model.position.y = 0.35;
    }
  }

  private onModelLoaded(model: Object3D) {
    if (!this.entity) {
      throw new Error(`Can't find parent entity`);
    }

    this.mixer?.stopAllAction();

    this.model = model;
    this.params.scene.add(this.model);

    this.model.scale.setScalar(this.params.scale);
    this.model.position.copy(this.entity.getPosition());

    // FIXME possible it is no necessary
    this.entity.setPosition(this.entity.getPosition());

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.model.traverse((c: Mesh) => {
      const materials: Material[] = c.material instanceof Array ? c.material : [c.material];

      // FIXME fake type declaration
      for (const m of (materials as MeshPhongMaterial[])) {
        if (m) {
          if (this.texture) {
            m.map = this.texture;
          }
          if (this.params.specular) {
            m.specular = this.params.specular;
          }
          if (this.params.emissive) {
            m.emissive = this.params.emissive;
          }
        }
      }

      if (this.params.receiveShadow != undefined) {
        c.receiveShadow = this.params.receiveShadow;
      }
      if (this.params.castShadow != undefined) {
        c.castShadow = this.params.castShadow;
      }
      if (this.params.visible != undefined) {
        c.visible = this.params.visible;
      }
    });

    this.mixer = new AnimationMixer(this.model);

    this.entity.isModelReady = true;
  }

  loadResources() {
    if (this.params.resourceTexture) {
      const textureLoader = new TextureLoader();
      this.texture = textureLoader.load(this.params.resourceTexture);
      this.texture.encoding = sRGBEncoding;
    }

    const path = this.params.resourcePath;
    const model = this.params.resourceModel;
    const animations = this.params.resourceAnimations;
    if (!model.endsWith('fbx')) {
      throw new Error(`Can't find loader for such type of file: ${model}`);
    }
    const manager = new LoadingManager();
    const loader = new FBXLoader(manager);
    loader.setPath(path);
    loader.load(model, (fbx) => {
      this.onModelLoaded(fbx);
      manager.onLoad = () => setTimeout(() => this.setActiveAnimationTrusted(Object.keys(this.animationMap)[0]), 100);
      Object.entries(animations).forEach(([key, fileName]) => {
        loader.load(fileName, (fbx) => this.onAnimationLoaded(key, fbx.animations[0]));
      });
    });
  }

  onAnimationLoaded(key: string, animationClip: AnimationClip) {
    if (!this.entity) {
      throw new Error(`Can't find parent entity`);
    }

    console.log('Found animation', key, animationClip.name);
    this.animationMap[animationClip.name] = this.mixer!.clipAction(animationClip);
  }
}
