import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { Controller } from 'src/engine/Controller';
import { UpdatePropertyEvent } from 'src/engine/UpdatePropertyEvent';
import { VisualEntityProperty } from 'src/entity/VisualEntityProperty';
import { SceneFactor } from 'src/factor/SceneFactor';
import { AnimationAction, AnimationClip, AnimationMixer, Object3D, Vector3, Quaternion } from 'three';
import { LogMethod } from 'src/utils/logger/LogMethod';
import { Level } from 'src/utils/logger/Level';
import { VisualEntity } from '../VisualEntity';
import { VisualEntityTopic } from 'src/entity/VisualEntityTopic';

export abstract class ModelController extends Controller<VisualEntity> {
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
    if (!(entity instanceof VisualEntity)) {
      throw new Error(`Can't make calculation for 3d Object in simple Entity. Use ${VisualEntity.name}`);
    }

    super(engine, entity, name);

    this.entity.registerProperty(VisualEntityProperty.Model, undefined);
    this.entity.registerProperty(VisualEntityProperty.IsModelReady, false);

    this.entity.on(VisualEntityTopic.UpdatePosition, this.onPositionChange.bind(this));
    this.entity.on(VisualEntityTopic.UpdateRotation, this.onRotationChange.bind(this));
  }

  get sceneFactor(): SceneFactor {
    return this.engine.factors.find(SceneFactor);
  }

  getAnimationList(): string[] {
    return Object.keys(this.animationMap);
  }

  protected abstract onPositionChange(m: UpdatePropertyEvent<Vector3>): void;
  protected abstract onRotationChange(m: UpdatePropertyEvent<Quaternion>): void;

  protected getModelOrThrow(): Object3D {
    if (!this.model) {
      throw new Error(`Can't find 3d model for ${this.constructorName}`);
    }

    return this.model;
  }

  protected getMixerOrThrow(): AnimationMixer {
    if (!this.mixer) {
      throw new Error(`Can't find 3d model mixer for ${this.constructorName}`);
    }

    return this.mixer;
  }

  @LogMethod({level: Level.info})
  protected setActiveAnimationTrusted(animationName: string) {
    this.activeAnimation?.stop();

    this.activeAnimationName = animationName;
    this.activeAnimation = this.animationMap[animationName];

    this.activeAnimation.play();
  }

  addAnimation(animationClip: AnimationClip): void {
    const mixer = this.getMixerOrThrow();

    console.log('Found animation', animationClip.name);
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
