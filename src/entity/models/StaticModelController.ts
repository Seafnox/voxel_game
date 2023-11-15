import { Entity } from 'src/engine/Entity';
import { Group, Vector3, sRGBEncoding, TextureLoader, Texture, Material, Mesh, Color, Quaternion } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MeshPhongMaterial } from 'three/src/materials/MeshPhongMaterial';
import { GameEngine } from 'src/engine/GameEngine';
import { ModelController } from './ModelController';

export interface StaticModelConfig {
  resourcePath: string;
  resourceName: string;
  scale: number;
  resourceTexture?: string;
  specular?: Color;
  emissive?: Color;
  receiveShadow?: boolean;
  castShadow?: boolean;
  visible?: boolean;
}

export class StaticModelController extends ModelController {
  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);
  }

  set modelConfig(config: StaticModelConfig) {
    this.loadModels(config);
  }

  onPositionChange(m: Vector3) {
    if (this.model) {
      this.model.position.copy(m);
    }
  }

  onRotationChange(m: Quaternion) {
      if (this.model) {
          this.model.quaternion.copy(m);
      }
  }
  loadModels(config: StaticModelConfig) {
    if (config.resourceName.endsWith('glb') || config.resourceName.endsWith('gltf')) {
      this.loadAsGLTF(config);
    } else if (config.resourceName.endsWith('fbx')) {
      this.loadAsFBX(config);
    }
  }

  onTargetLoaded(obj: Group, config: StaticModelConfig) {
    const entity = this.entity;

    this.model = obj;
    this.sceneFactor.add(this.model);

    this.model.scale.setScalar(config.scale);
    this.entity && this.model.position.copy(entity.getPosition());

    let texture: Texture | null = null;
    if (config.resourceTexture) {
      const texLoader = new TextureLoader();
      texture = texLoader.load(config.resourceTexture);
      texture.encoding = sRGBEncoding;
    }

    // FIXME fake type declaration
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    this.model.traverse((c: Mesh) => {
      const materials: Material[] = c.material instanceof Array ? c.material : [c.material];

      // FIXME fake type declaration
      for (const m of (materials as MeshPhongMaterial[])) {
        if (m) {
          if (texture) {
            m.map = texture;
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

    entity.isModelReady = true;
  }

  loadAsGLTF(config: StaticModelConfig) {
    const loader = new GLTFLoader();
    loader.setPath(config.resourcePath);
    loader.load(config.resourceName, (glb) => {
      this.onTargetLoaded(glb.scene, config);
    });
  }

  loadAsFBX(config: StaticModelConfig) {
    const loader = new FBXLoader();
    loader.setPath(config.resourcePath);
    loader.load(config.resourceName, (fbx) => {
      this.onTargetLoaded(fbx, config);
    });
  }

  public update(): void {}
}
