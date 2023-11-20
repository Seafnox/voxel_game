import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { UpdatePropertyEvent } from 'src/engine/UpdatePropertyEvent';
import { RotationProperty, ModelReadyProperty, ModelProperty } from 'src/entity/properties/visual';
import { PositionProperty } from 'src/entity/properties/visual';
import { Vector3, Color, TextureLoader, Texture, AnimationMixer, Object3D, Mesh, LoadingManager, Quaternion, AnimationClip, SRGBColorSpace } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MeshPhongMaterial } from 'three/src/materials/MeshPhongMaterial';
import { ModelController } from 'src/entity/models/ModelController';

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

  onPositionChange(event: UpdatePropertyEvent<Vector3>) {
    this.model?.position.copy(event.next);
  }

  onRotationChange(event: UpdatePropertyEvent<Quaternion>) {
    this.model?.quaternion.copy(event.next);
  }

  // TODO refactor code and replace identical code to abstract class method
  private onModelLoaded(model: Object3D, animations: AnimationClip[], config: GltfModelConfig) {
    this.model = model;
    this.sceneFactor.add(model);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.model.traverse((mesh: Mesh) => {
      // FIXME fake type declaration
      const materials = (mesh.material instanceof Array ? mesh.material : [mesh.material]) as MeshPhongMaterial[];

      for (const material of materials) {
        if (material) {
          if (this.texture) {
            material.map = this.texture;
          }
          if (config.specular) {
            material.specular = config.specular;
          }
          if (config.emissive) {
            material.emissive = config.emissive;
          }
        }
      }

      if (config.receiveShadow != undefined) {
        mesh.receiveShadow = config.receiveShadow;
      }
      if (config.castShadow != undefined) {
        mesh.castShadow = config.castShadow;
      }
      if (config.visible != undefined) {
        mesh.visible = config.visible;
      }
    });

    this.model.scale.setScalar(config.scale);
    const entityPosition = this.entity.getProperty<Vector3>(PositionProperty);
    const entityRotation = this.entity.getProperty<Quaternion>(RotationProperty);
    this.model.position.copy(entityPosition);
    this.model.quaternion.copy(entityRotation);

    this.animationMap = {};
    this.mixer = new AnimationMixer(this.model);

    animations.forEach(animationClip => this.addAnimation(animationClip));
    this.entity.setProperty(ModelProperty, this.model);
    this.entity.setProperty(ModelReadyProperty, true);
  }

  loadResources(config: GltfModelConfig) {
    if (config.resourceTexture) {
      const textureLoader = new TextureLoader();
      this.texture = textureLoader.load(config.resourceTexture);
      this.texture.colorSpace = SRGBColorSpace;
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

      this.onModelLoaded(glb.scene, glb.animations, config);
    });
  }
}
