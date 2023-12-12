import { RandomFn } from 'simplex-noise/simplex-noise';

export class VMath {
  static epsilon: number = 0.02;
  static superEpsilon: number = 0.002;
  static megaEpsilon: number = 0.00002;
  static random: RandomFn = Math.random;

  static rand_range(min: number, max: number) {
    return VMath.lerp(VMath.random(), min, max);
  }

  static rand_int(min: number, max: number) {
    return Math.round(VMath.rand_range(min, max));
  }

  static lerp(normal: number, min: number, max: number) {
    return normal * (max - min) + min;
  }

  static revertLerp(real: number, min: number, max: number) {
    return (real - min) / (max - min);
  }

  static sat(x: number) {
    return Math.min(Math.max(x, 0.0), 1.0);
  }
}
