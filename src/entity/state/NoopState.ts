import { SimpleState } from 'src/entity/state/SimpleState';

export class NoopState extends SimpleState {
  enter(): void {}

  exit(): void {}

  validate(): void {}

}
