import {
  FileLoader,
  LoadingManager,
  Loader,
  Group,
  AnimationClip,
  VectorKeyframeTrack,
  QuaternionKeyframeTrack,
  NumberKeyframeTrack,
  ColorKeyframeTrack,
} from 'three';
import { KeyframeTrack } from 'three/src/animation/KeyframeTrack';
import { arrayBufferToString } from '../../utils/ArrayBufferToString';
import { isObject } from '../../utils/isObject';
import { ModelUnit } from './ModelUnit';
import {
  ModelUnitAnimationConfig,
  ModelUnitAnimationTrackType,
  ModelUnitAnimationTrackConfig,
  ModelUnitAnimationPositionConfig,
  ModelUnitAnimationRotationConfig,
  ModelUnitAnimationScaleConfig,
  ModelUnitAnimationOpacityConfig,
  ModelUnitAnimationColorConfig,
} from './ModelUnitAnimationConfig';
import { CustomModelUnitConfig } from './unitConfig/CustomModelUnitConfig';

export interface ModelConfiguration {
  modelConfig: Record<string, CustomModelUnitConfig>;
  animations: Record<string, ModelUnitAnimationConfig>;
  mouseSensitive?: string[];
}

export interface ConfigurableModel {
  model: Group;
  animations: AnimationClip[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type KeyframeBuilder = (times: number[], config: ModelUnitAnimationTrackConfig) => KeyframeTrack;

export class ConfigurableModelLoader extends Loader<ConfigurableModel> {
  constructor(manager?: LoadingManager) {
    super(manager);
  }

  load(
    url: string,
    onLoad: (data: ConfigurableModel) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (err: unknown) => void,
  ) {
    const loader = new FileLoader(this.manager);
    loader.setPath(this.path);
    loader.setRequestHeader(this.requestHeader);
    loader.setWithCredentials(this.withCredentials);
    loader.load(url, (data) => {

      try {
        const modelInfo: string = typeof data !== 'string' ? arrayBufferToString(data) : data;
        onLoad(this.buildModel(this.validate(JSON.parse(modelInfo))));
      } catch (e) {
        if (onError) {
          onError(e);
        } else {
          console.error(e);
        }
        this.manager.itemError(url);
      }
    }, onProgress, onError);
  }

  private validate(modelInfo: unknown): ModelConfiguration {
    if (!isObject(modelInfo)) {
      throw new Error(`Invalid model configuration file. Model configuration must be an object.`);
    }
    if (!('modelConfig' in modelInfo) || 'modelConfig' in modelInfo && !isObject(modelInfo.modelConfig)) {
      throw new Error(`Invalid model configuration file. 'modelConfig' property must be an object.`);
    }
    if (!('animations' in modelInfo) || 'animations' in modelInfo && !isObject(modelInfo.animations)) {
      throw new Error(`Invalid model configuration file. 'animations' property must be an object.`);
    }
    if ('mouseSensitive' in modelInfo && !Array.isArray(modelInfo.mouseSensitive)) {
      throw new Error(`Invalid model configuration file. 'mouseSensitive' property must be an array.`);
    }

    return modelInfo as ModelConfiguration;
  }

  private buildModel(config: ModelConfiguration): ConfigurableModel {
    const model = new Group();
    Object.keys(config.modelConfig).forEach((key) => {
      const modelUnitConfig = config.modelConfig[key];
      const modelUnit = ModelUnit.build(modelUnitConfig);
      modelUnit.name = key;
      model.add(modelUnit);
    });

    const animations: AnimationClip[] = [];
    Object.keys(config.animations).forEach((animationName) => {
      const currentAnimationConfig = config.animations[animationName];
      const animationClip = this.makeAnimationClip(animationName, currentAnimationConfig);
      animations.push(animationClip);
    });

    return { model, animations };
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
