import { VMath } from 'src/VMath';
import { Vector3 } from 'three';

export function isDifferentVector(first: Vector3, second: Vector3): boolean {
  return [
  Math.abs(first.x - second.x) > VMath.epsilon,
  Math.abs(first.y - second.y) > VMath.epsilon,
  Math.abs(first.z - second.z) > VMath.epsilon,
  ].some(Boolean);
}
