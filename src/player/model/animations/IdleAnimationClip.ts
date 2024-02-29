import {
  VectorKeyframeTrack,
  Vector3,
  Quaternion,
  QuaternionKeyframeTrack,
  ColorKeyframeTrack,
  InterpolateDiscrete,
  NumberKeyframeTrack,
  AnimationClip,
} from 'three';

// POSITION
const positionKF = new VectorKeyframeTrack( '.position', [ 0, 1, 2 ], [ 0, 0, 0, 30, 0, 0, 0, 0, 0 ] );

// SCALE
const scaleKF = new VectorKeyframeTrack( '.scale', [ 0, 1, 2 ], [ 1, 1, 1, 2, 2, 2, 1, 1, 1 ] );

// ROTATION
// Rotation should be performed using quaternions, using a QuaternionKeyframeTrack
// Interpolating Euler angles (.rotation property) can be problematic and is currently not supported

// set up rotation about x axis
const xAxis = new Vector3( 1, 0, 0 );

const qInitial = new Quaternion().setFromAxisAngle( xAxis, 0 );
const qFinal = new Quaternion().setFromAxisAngle( xAxis, Math.PI );
const quaternionKF = new QuaternionKeyframeTrack( '.quaternion', [ 0, 1, 2 ], [ qInitial.x, qInitial.y, qInitial.z, qInitial.w, qFinal.x, qFinal.y, qFinal.z, qFinal.w, qInitial.x, qInitial.y, qInitial.z, qInitial.w ] );

// COLOR
const colorKF = new ColorKeyframeTrack( '.material.color', [ 0, 1, 2 ], [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ], InterpolateDiscrete );

// OPACITY
const opacityKF = new NumberKeyframeTrack( '.material.opacity', [ 0, 1, 2 ], [ 1, 0, 1 ] );

// create an animation sequence with the tracks
// If a negative time value is passed, the duration will be calculated from the times of the passed tracks array
export const IdleAnimationClip = new AnimationClip( 'Idle', 3, [ scaleKF, positionKF, quaternionKF, colorKF, opacityKF ] );
