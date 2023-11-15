import {
  Vector3,
  Scene,
  Color,
  TextureLoader,
  sRGBEncoding,
  Texture,
  Material,
  AnimationMixer,
  Object3D,
  Mesh,
  LoadingManager,
  Quaternion,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MeshPhongMaterial } from 'three/src/materials/MeshPhongMaterial';
import { Entity } from '../../engine/Entity';
import { GameEngine } from '../../engine/GameEngine';
import { ModelController } from './ModelController';

export interface GltfModelConfig {
  resourcePath: string;
  resourceModel: string;
  scene: Scene;
  scale: number;
  resourceTexture?: string;
  specular?: Color;
  emissive?: Color;
  receiveShadow?: boolean;
  castShadow?: boolean;
  visible?: boolean;
}

export class GltfModelController extends ModelController {
  private texture: Texture | undefined;

  constructor(
    private params: GltfModelConfig,
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);
    this.loadResources();
  }

  onPositionChange(m: Vector3) {
    this.model?.position.copy(m);
  }

  onRotationChange(m: Quaternion) {
    this.model?.quaternion.copy(m);
  }

  private onModelLoaded(model: Object3D) {
    this.model = model;
    this.params.scene.add(this.model);

    this.model.scale.setScalar(this.params.scale);

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
  }

  loadResources() {
    if (this.params.resourceTexture) {
      const textureLoader = new TextureLoader();
      this.texture = textureLoader.load(this.params.resourceTexture);
      this.texture.encoding = sRGBEncoding;
    }

    const path = this.params.resourcePath;
    const model = this.params.resourceModel;

    if (!model.endsWith('glb') && !model.endsWith('gltf')) {
      throw new Error(`Can't find loader for such type of file: ${model}`);
    }

    const manager = new LoadingManager();
    const loader = new GLTFLoader(manager);
    loader.setPath(path);
    loader.load(model, (glb) => {
      this.mixer?.stopAllAction();

      this.onModelLoaded(glb.scene);

      const entity = this.getVisualEntityOrThrow();
      const model = this.getModelOrThrow();

      model.position.copy(entity.getPosition());

      this.animationMap = {};
      this.mixer = new AnimationMixer(model);

      glb.animations.forEach(animationClip => this.addAnimation(animationClip));

      // FIXME possible it is no necessary
      entity.setPosition(entity.getPosition());

      entity.isModelReady = true;
    });
  }
}
