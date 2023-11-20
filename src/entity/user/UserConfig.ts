import { Vector3 } from 'three';

export const MinAnimatedVelocity = 0.9;
export const MinRunVelocity = 20;
export function realVelocity(velocity: Vector3): number {
  return (velocity.x ** 2 + velocity.z ** 2) ** 0.5;
}
