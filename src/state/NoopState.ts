import { SimpleState } from 'src/state/SimpleState';

export class NoopState extends SimpleState {
  enter(): void {}

  exit(): void {}

  validate(): void {}

}
