import { Entity } from 'src/engine/Entity';
import {
  Vector3,
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
import { GameEngine } from '../../engine/GameEngine';
import { ModelController } from './ModelController';

export interface GltfModelConfig {
  resourcePath: string;
  resourceModel: string;
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
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);
  }

  set modelConfig(config: GltfModelConfig) {
    this.loadResources(config);
  }

  onPositionChange(m: Vector3) {
    this.model?.position.copy(m);
  }

  onRotationChange(m: Quaternion) {
    this.model?.quaternion.copy(m);
  }

  private onModelLoaded(model: Object3D, config: GltfModelConfig) {
    this.model = model;
    this.sceneFactor.add(this.model);

    this.model.scale.setScalar(config.scale);

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
          if (config.specular) {
            m.specular = config.specular;
          }
          if (config.emissive) {
            m.emissive = config.emissive;
          }
        }
      }

      if (config.receiveShadow != undefined) {
        c.receiveShadow = config.receiveShadow;
      }
      if (config.castShadow != undefined) {
        c.castShadow = config.castShadow;
      }
      if (config.visible != undefined) {
        c.visible = config.visible;
      }
    });
  }

  loadResources(config: GltfModelConfig) {
    if (config.resourceTexture) {
      const textureLoader = new TextureLoader();
      this.texture = textureLoader.load(config.resourceTexture);
      this.texture.encoding = sRGBEncoding;
    }

    const path = config.resourcePath;
    const model = config.resourceModel;

    if (!model.endsWith('glb') && !model.endsWith('gltf')) {
      throw new Error(`Can't find loader for such type of file: ${model}`);
    }

    const manager = new LoadingManager();
    const loader = new GLTFLoader(manager);
    loader.setPath(path);
    loader.load(model, (glb) => {
      this.mixer?.stopAllAction();

      this.onModelLoaded(glb.scene, config);

      const entity = this.entity;
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
