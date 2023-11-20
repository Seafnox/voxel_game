import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { UpdatePropertyEvent } from 'src/engine/UpdatePropertyEvent';
import { RotationProperty, ModelReadyProperty, ModelProperty, PositionProperty } from 'src/entity/properties/visual';
import { SceneFactor } from 'src/factor/SceneFactor';
import { Level } from 'src/utils/logger/Level';
import { LogMethod } from 'src/utils/logger/LogMethod';
import {
  AnimationAction,
  AnimationClip,
  AnimationMixer,
  Object3D,
  Vector3,
  Quaternion,
  Color,
  Group,
  Texture,
  TextureLoader,
  Mesh,
  Material,
  SRGBColorSpace,
} from 'three';
import { MeshPhongMaterial } from 'three/src/materials/MeshPhongMaterial';

export interface ModelConfig {
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

export abstract class ModelController<TConfig extends ModelConfig = ModelConfig> extends Controller {
  protected model: Object3D | undefined;
  protected animationMap: Record<string, AnimationAction> = {};
  protected mixer: AnimationMixer | undefined;
  protected activeAnimationName: string | undefined;
  protected activeAnimation: AnimationAction | undefined;

  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

    this.entity.registerProperty(ModelProperty, undefined);
    this.entity.registerProperty(ModelReadyProperty, false);

    this.entity.on(PositionProperty, this.onPositionChange.bind(this));
    this.entity.on(RotationProperty, this.onRotationChange.bind(this));
  }

  get sceneFactor(): SceneFactor {
    return this.engine.factors.find(SceneFactor);
  }

  getAnimationList(): string[] {
    return Object.keys(this.animationMap);
  }

  set modelConfig(config: TConfig) {
    this.loadModels(config);
  }

  protected abstract loadModels(config: TConfig): void;

  protected onPositionChange(event: UpdatePropertyEvent<Vector3>) {
    this.model?.position.copy(event.next);
  }

  protected onRotationChange(event: UpdatePropertyEvent<Quaternion>) {
    this.model?.quaternion.copy(event.next);
  }

  protected onTargetLoaded(obj: Group, config: TConfig) {
    this.model = obj;
    this.sceneFactor.add(this.model);

    this.model.scale.setScalar(config.scale);
    const entityPosition = this.entity.getProperty<Vector3>(PositionProperty);
    const entityRotation = this.entity.getProperty<Quaternion>(RotationProperty);
    this.model.position.copy(entityPosition);
    this.model.quaternion.copy(entityRotation);

    let texture: Texture | null = null;
    if (config.resourceTexture) {
      const texLoader = new TextureLoader();
      texture = texLoader.load(config.resourceTexture);
      texture.colorSpace = SRGBColorSpace;
    }

    this.model.traverse(modelObject => {
      const modelMesh = modelObject as Mesh;
      const materials: Material[] = modelMesh.material instanceof Array ? modelMesh.material : [modelMesh.material];

      // FIXME fake type declaration
      for (const material of (materials as MeshPhongMaterial[])) {
        if (material) {
          if (texture) {
            material.map = texture;
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
        modelMesh.receiveShadow = config.receiveShadow;
      }

      if (config.castShadow != undefined) {
        modelMesh.castShadow = config.castShadow;
      }

      if (config.visible != undefined) {
        modelMesh.visible = config.visible;
      }
    });

    this.entity.setProperty(ModelProperty, this.model);
    this.entity.setProperty(ModelReadyProperty, true);
  }

  protected getMixerOrThrow(): AnimationMixer {
    if (!this.mixer) {
      throw new Error(`Can't find 3d model mixer for ${this.constructorName}`);
    }

    return this.mixer;
  }

  protected setActiveAnimationTrusted(animationName: string) {
    console.log(this.constructorName, 'Set Active Animation', this.entity.name, animationName);
    const prevAnimation = this.activeAnimation;

    this.activeAnimationName = animationName;
    this.activeAnimation = this.animationMap[animationName];

    this.activeAnimation.play();
    prevAnimation?.stop();
  }

  addAnimation(animationClip: AnimationClip): void {
    const mixer = this.getMixerOrThrow();

    console.log(this.constructorName, 'Add animation', this.entity.name, animationClip.name);
    this.animationMap[animationClip.name] = mixer.clipAction(animationClip);
  }

  @LogMethod({level: Level.info})
  setActiveAnimation(animationName: string) {
    const animations = this.animationMap;

    if (!animations[animationName]) {
      console.warn(`Can't find animation '${animationName}' in list [${Object.keys(animations).join(', ')}]`);
      return;
    }

    this.setActiveAnimationTrusted(animationName);
  }

  update(deltaTime: number) {
    this.mixer?.update(deltaTime / 1000);
  }
}
