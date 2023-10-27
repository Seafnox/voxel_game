import {Component} from "../commons/Component";
import {AnimationAction, AnimationClip, AnimationMixer, Object3D} from "three";
import {Entity} from "../commons/Entity";
import {LogMethod} from "../../utils/logger/LogMethod";
import {Level} from "../../utils/logger/Level";

export abstract class ModelController implements Component {
  entity: Entity | undefined;
  protected model: Object3D | undefined;
  protected animationMap: Record<string, AnimationAction> = {};
  protected mixer: AnimationMixer | undefined;
  protected activeAnimationName: string | undefined;
  protected activeAnimation: AnimationAction | undefined;

  getModel(): Object3D | undefined {
    return this.model;
  }

  getAnimationList(): string[] {
    return Object.keys(this.animationMap);
  }

  getConstructorName(): string {
    return this.constructor.name;
  }

  protected getEntityOrThrow(): Entity {
    if (!this.entity) {
      throw new Error(`Can't find parent entity for ${this.getConstructorName()}`);
    }

    return this.entity;
  }

  protected getModelOrThrow(): Object3D {
    if (!this.model) {
      throw new Error(`Can't find 3d model for ${this.getConstructorName()}`);
    }

    return this.model;
  }
  protected getMixerOrThrow(): AnimationMixer {
    if (!this.mixer) {
      throw new Error(`Can't find 3d model mixer for ${this.getConstructorName()}`);
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

  setActiveAnimation(animationName: string) {
    const animations = this.animationMap;

    if (!animations[animationName]) {
      console.warn(`Can't find animation '${animationName}' in list [${Object.keys(animations).join(', ')}]`);
      return;
    }

    this.setActiveAnimationTrusted(animationName);
  }

  // @LogMethod({logType: [LogAction.entry], level: Level.info})
  update(deltaTime: number) {
    this.mixer?.update(deltaTime/1000);
  }
}
