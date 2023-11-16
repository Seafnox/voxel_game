import { VMath } from 'src/VMath';
import { Quaternion } from 'three';

export function isDifferentQuaternion(first: Quaternion, second: Quaternion): boolean {
  return [
    Math.abs(first.x - second.x) > VMath.epsilon,
    Math.abs(first.y - second.y) > VMath.epsilon,
    Math.abs(first.z - second.z) > VMath.epsilon,
    Math.abs(first.w - second.w) > VMath.epsilon,
  ].some(Boolean);
}
