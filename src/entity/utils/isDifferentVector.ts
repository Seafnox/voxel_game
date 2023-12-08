import { VMath } from 'src/VMath';
import { Vector3 } from 'three';

export function isDifferentVector(first: Vector3, second: Vector3): boolean {
  return first.distanceTo(second) > VMath.superEpsilon;
}
