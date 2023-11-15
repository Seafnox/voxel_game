import { AnimationAction } from 'three';
import { StateInput } from './StateInput';
import { StateMachine } from './StateMachine';
import { VisualEntity } from '../VisualEntity';

export interface SimpleStateConstructor {
  // eslint-disable-next-line @typescript-eslint/no-misused-new
  new(controller: StateMachine, entity: VisualEntity): SimpleState;
}

export interface SimpleState {
  availableNext: SimpleState[] | undefined;
  action: AnimationAction | undefined;

  exit(nextState: SimpleState): void;

  enter(prevState: SimpleState | undefined): void;

  validate(deltaTime: number, input: StateInput): void;
}
