import { Group, AnimationClip, NumberKeyframeTrack, VectorKeyframeTrack, QuaternionKeyframeTrack, ColorKeyframeTrack } from 'three';
import { KeyframeTrack } from 'three/src/animation/KeyframeTrack';
import { ModelController, ModelConfig } from '../ModelController';
import { CustomModelUnitConfig } from './unitConfig/CustomModelUnitConfig';
import { ModelUnit } from './ModelUnit';
import {
  ModelUnitAnimationConfig,
  ModelUnitAnimationTrackType,
  ModelUnitAnimationPositionConfig,
  ModelUnitAnimationRotationConfig,
  ModelUnitAnimationScaleConfig,
  ModelUnitAnimationOpacityConfig,
  ModelUnitAnimationColorConfig,
  ModelUnitAnimationTrackConfig,
} from './ModelUnitAnimationConfig';

export interface ConfigurableModelConfig extends ModelConfig {
  modelConfig: Record<string, CustomModelUnitConfig>;
  animations: Record<string, ModelUnitAnimationConfig>;
  mouseSensitive?: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type KeyframeBuilder = (times: number[], config: ModelUnitAnimationTrackConfig) => KeyframeTrack;

export class ConfigurableModelController extends ModelController<ConfigurableModelConfig> {
  protected loadModels(config: ConfigurableModelConfig) {
    const modelGroup = new Group();
    Object.keys(config.modelConfig).forEach((key) => {
      const modelUnitConfig = config.modelConfig[key];
      const modelUnit = ModelUnit.build(modelUnitConfig);
      modelUnit.name = key;
      modelUnit.visible = config.visible ?? true;
      modelGroup.add(modelUnit);
    });

    const animationClips: AnimationClip[] = [];
    Object.keys(config.animations).forEach((animationName) => {
      const currentAnimationConfig = config.animations[animationName];
      const animationClip = this.makeAnimationClip(animationName, currentAnimationConfig);
      animationClips.push(animationClip);
    });

    this.onTargetLoaded(modelGroup, animationClips, config);
  }

  private makeAnimationClip(name: string, config: ModelUnitAnimationConfig): AnimationClip {
    const keyframeTracks: KeyframeTrack[] = [];
    const times = Array(config.duration).fill(0).map((_, i) => i);
    const keyframeBuilderMap: Record<ModelUnitAnimationTrackType, KeyframeBuilder> = {
      [ModelUnitAnimationTrackType.Position]: this.makePositionKeyframes.bind(this),
      [ModelUnitAnimationTrackType.Rotation]: this.makeRotationKeyframes.bind(this),
      [ModelUnitAnimationTrackType.Scale]: this.makeScaleKeyframes.bind(this),
      [ModelUnitAnimationTrackType.Opacity]: this.makeOpacityKeyframes.bind(this),
      [ModelUnitAnimationTrackType.Color]: this.makeColorKeyframes.bind(this),
    };

    config.changes.forEach((keyframeConfig) => {
      const keyframeBuilder: KeyframeBuilder = keyframeBuilderMap[keyframeConfig.type];
      if (!keyframeBuilder) {
        throw new Error(`Unknown keyframe type: ${keyframeConfig.type}`);
      }
      keyframeTracks.push(keyframeBuilder(times, keyframeConfig));
    });
    return new AnimationClip(name, config.duration, keyframeTracks);
  }

  private makePositionKeyframes(times: number[], abstractKeyframeConfig: ModelUnitAnimationTrackConfig): KeyframeTrack {
    const keyframeConfig = abstractKeyframeConfig as ModelUnitAnimationPositionConfig;
    const values: number[] = [];
    times.forEach((_, i) => {
      values.push(keyframeConfig.value.x * (i / (times.length - 1)));
      values.push(keyframeConfig.value.y * (i / (times.length - 1)));
      values.push(keyframeConfig.value.z * (i / (times.length - 1)));
    });
    return new VectorKeyframeTrack('.position', times, values);
  }

  private makeRotationKeyframes(times: number[], abstractKeyframeConfig: ModelUnitAnimationTrackConfig): KeyframeTrack {
    const keyframeConfig = abstractKeyframeConfig as ModelUnitAnimationRotationConfig;
    const values: number[] = [];
    times.forEach((_, i) => {
      values.push(keyframeConfig.value.x * (i / (times.length - 1)));
      values.push(keyframeConfig.value.y * (i / (times.length - 1)));
      values.push(keyframeConfig.value.z * (i / (times.length - 1)));
      values.push(keyframeConfig.value.w * (i / (times.length - 1)));
    });
    return new QuaternionKeyframeTrack('.quaternion', times, values);
  }

  private makeScaleKeyframes(times: number[], abstractKeyframeConfig: ModelUnitAnimationTrackConfig): KeyframeTrack {
    const keyframeConfig = abstractKeyframeConfig as ModelUnitAnimationScaleConfig;
    const values: number[] = [];
    times.forEach((_, i) => {
      values.push(keyframeConfig.value.x * (i / (times.length - 1)));
      values.push(keyframeConfig.value.y * (i / (times.length - 1)));
      values.push(keyframeConfig.value.z * (i / (times.length - 1)));
    });
    return new VectorKeyframeTrack('.scale', times, values);
  }

  private makeOpacityKeyframes(times: number[], abstractKeyframeConfig: ModelUnitAnimationTrackConfig): KeyframeTrack {
    const keyframeConfig = abstractKeyframeConfig as ModelUnitAnimationOpacityConfig;
    const values: number[] = [];
    times.forEach((_, i) => {
      values.push(keyframeConfig.value * (i / (times.length - 1)));
    });
    return new NumberKeyframeTrack('.material.opacity', times, values);
  }

  private makeColorKeyframes(times: number[], abstractKeyframeConfig: ModelUnitAnimationTrackConfig): KeyframeTrack {
    const keyframeConfig = abstractKeyframeConfig as ModelUnitAnimationColorConfig;
    const values: number[] = [];
    times.forEach((_, i) => {
      values.push(keyframeConfig.value.r * (i / (times.length - 1)));
      values.push(keyframeConfig.value.g * (i / (times.length - 1)));
      values.push(keyframeConfig.value.b * (i / (times.length - 1)));
    });
    return new ColorKeyframeTrack('.material.color', times, values);
  }
}
