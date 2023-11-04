export class VMath {
  static epsilon: number = 0.002;

  static rand_range(a: number, b: number) {
    return Math.random() * (b - a) + a;
  }

  static rand_normalish() {
    const r = Math.random() + Math.random() + Math.random() + Math.random();
    return (r / 4.0) * 2.0 - 1;
  }

  static rand_int(a: number, b: number) {
    return Math.round(Math.random() * (b - a) + a);
  }

  static lerp(x: number, a: number, b: number) {
    return x * (b - a) + a;
  }

  static smoothstep(x: number, a: number, b: number) {
    x = x * x * (3.0 - 2.0 * x);
    return x * (b - a) + a;
  }

  static smootherstep(x: number, a: number, b: number) {
    x = x * x * x * (x * (x * 6 - 15) + 10);
    return x * (b - a) + a;
  }

  static clamp(x: number, a: number, b: number) {
    return Math.min(Math.max(x, a), b);
  }

  static sat(x: number) {
    return Math.min(Math.max(x, 0.0), 1.0);
  }

  static in_range(x: number, a: number, b: number) {
    return x >= a && x <= b;
  }
}
