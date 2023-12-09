import { VMath } from 'src/VMath';
import { Quaternion } from 'three';

export function isDifferentQuaternion(first: Quaternion, second: Quaternion): boolean {
  return [
    Math.abs(first.x - second.x) > VMath.superEpsilon,
    Math.abs(first.y - second.y) > VMath.superEpsilon,
    Math.abs(first.z - second.z) > VMath.superEpsilon,
    Math.abs(first.w - second.w) > VMath.superEpsilon,
  ].some(Boolean);
}
