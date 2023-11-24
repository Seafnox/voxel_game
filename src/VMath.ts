export class VMath {
  static epsilon: number = 0.02;

  static rand_range(min: number, max: number) {
    return VMath.lerp(Math.random(), min, max);
  }

  static rand_int(min: number, max: number) {
    return Math.round(VMath.rand_range(min, max));
  }

  static lerp(normal: number, min: number, max: number) {
    return normal * (max - min) + min;
  }

  static sat(x: number) {
    return Math.min(Math.max(x, 0.0), 1.0);
  }
}
