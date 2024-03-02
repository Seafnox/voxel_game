import { Vector3, Color, Quaternion } from 'three';

export interface ModelUnitAnimationConfig {
  duration: number;
  changes: ModelUnitAnimationTrackConfig[];
}

export const enum ModelUnitAnimationTrackType {
  Position = 'position',
  Rotation = 'rotation',
  Scale = 'scale',
  Opacity = 'opacity',
  Color = 'color',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ModelUnitAnimationTrackConfig<T = any> {
  type: ModelUnitAnimationTrackType;
  value: T;
}

export interface ModelUnitAnimationPositionConfig extends ModelUnitAnimationTrackConfig<Vector3> {
  type: ModelUnitAnimationTrackType.Position;
}

export interface ModelUnitAnimationRotationConfig extends ModelUnitAnimationTrackConfig<Quaternion> {
  type: ModelUnitAnimationTrackType.Rotation;
}

export interface ModelUnitAnimationScaleConfig extends ModelUnitAnimationTrackConfig<Vector3> {
  type: ModelUnitAnimationTrackType.Scale;
}

export interface ModelUnitAnimationOpacityConfig extends ModelUnitAnimationTrackConfig<number> {
  type: ModelUnitAnimationTrackType.Opacity;
}

export interface ModelUnitAnimationColorConfig extends ModelUnitAnimationTrackConfig<Color> {
  type: ModelUnitAnimationTrackType.Color;
}

export type SummaryUnitAnimationConfig =
  ModelUnitAnimationPositionConfig
  | ModelUnitAnimationRotationConfig
  | ModelUnitAnimationScaleConfig
  | ModelUnitAnimationOpacityConfig
  | ModelUnitAnimationColorConfig;
