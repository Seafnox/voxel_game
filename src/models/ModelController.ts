import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { UpdatePropertyEvent } from 'src/engine/UpdatePropertyEvent';
import { ModelProperty } from 'src/models/ModelProperty';
import { ModelStatusProperty } from 'src/models/ModelStatusProperty';
import { PositionProperty } from 'src/positioning/PositionProperty';
import { RotationProperty } from 'src/positioning/RotationProperty';
import { SceneProperty } from 'src/render/SceneProperty';
import { ModelSystem } from 'src/models/ModelSystem';
import { TickSystem, TickSystemEvent } from 'src/browser/TickSystem';
import {
  AnimationAction,
  AnimationClip,
  AnimationMixer,
  Object3D,
  Vector3,
  Quaternion,
  Color,
  Mesh,
  Material,
} from 'three';
import { MeshPhongMaterial } from 'three/src/materials/MeshPhongMaterial';

export interface ModelConfig {
  resourcePath: string;
  scale: number;
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

    this.entity.properties.register(ModelProperty, undefined as Object3D | undefined);
    this.entity.properties.register(ModelStatusProperty, false as boolean);

    this.entity.on(PositionProperty.name, this.onPositionChange.bind(this));
    this.entity.on(RotationProperty.name, this.onRotationChange.bind(this));
//    this.engine.systems.find(TickSystem).on(TickSystemEvent.Init, this.init.bind(this));
    this.engine.systems.find(TickSystem).on(TickSystemEvent.Tick, this.tick.bind(this));
  }

  get modelSystem(): ModelSystem {
    return this.engine.systems.find(ModelSystem);
  }

  get sceneProperty(): SceneProperty {
    return this.engine.properties.find(SceneProperty);
  }

  getAnimationList(): string[] {
    return Object.keys(this.animationMap);
  }

  set modelConfig(config: TConfig) {
    this.loadModels(config);
  }

  setActiveAnimation(animationName: string) {
    const animations = this.animationMap;

    if (!animations[animationName]) {
      console.warn(`Can't find animation '${animationName}' in list [${Object.keys(animations).join(', ')}]`);
      return;
    }

    this.setActiveAnimationTrusted(animationName);
  }

  protected tick(deltaTime: number) {
    this.mixer?.update(deltaTime / 1000);
  }

  protected abstract loadModels(config: TConfig): void;

  protected addAnimation(animationClip: AnimationClip): void {
    const mixer = this.getMixerOrThrow();

    console.log(this.constructorName, 'Add animation', this.entity.name, animationClip.name);
    this.animationMap[animationClip.name] = mixer.clipAction(animationClip);
  }

  protected onPositionChange(event: UpdatePropertyEvent<Vector3>) {
    this.model?.position.copy(event.next);
  }

  protected onRotationChange(event: UpdatePropertyEvent<Quaternion>) {
    this.model?.quaternion.copy(event.next);
  }

  protected onTargetLoaded(model: Object3D, animations: AnimationClip[], config: TConfig) {
    this.model = model;
    this.sceneProperty.add(this.model);
    this.animationMap = {};
    this.mixer = new AnimationMixer(this.model);
    animations.forEach(animationClip => this.addAnimation(animationClip));

    this.model.scale.setScalar(config.scale);
    const entityPosition = this.entity.properties.find(PositionProperty).get();
    const entityRotation = this.entity.properties.find(RotationProperty).get();
    this.model.position.copy(entityPosition);
    this.model.quaternion.copy(entityRotation);

    this.model.traverse(modelObject => {
      const modelMesh = modelObject as Mesh;
      const materials: Material[] = modelMesh.material instanceof Array ? modelMesh.material : [modelMesh.material];

      // FIXME fake type declaration
      for (const material of (materials as MeshPhongMaterial[])) {
        if (material) {
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

    this.entity.properties.find(ModelProperty).set(this.model);
    this.entity.properties.find(ModelStatusProperty).set(true);
  }

  protected getMixerOrThrow(): AnimationMixer {
    if (!this.mixer) {
      throw new Error(`Can't find 3d model mixer for ${this.constructorName} in '${this.entityName}'`);
    }

    return this.mixer;
  }

  protected setActiveAnimationTrusted(animationName: string) {
    console.log(this.constructorName, 'Set Active Animation', this.entityName, animationName);
    const prevAnimation = this.activeAnimation;

    this.activeAnimationName = animationName;
    this.activeAnimation = this.animationMap[animationName];

    this.activeAnimation.play();
    prevAnimation?.stop();
  }
}
