import { GameEngine } from 'src/engine/GameEngine';
import { StateController } from 'src/entity/state/StateController';
import { VisualEntity } from 'src/entity/VisualEntity';
import { AnimationAction } from 'three';

export interface SimpleStateConstructor {
  new(
    engine: GameEngine,
    entity: VisualEntity,
    controller: StateController,
  ): SimpleState;
}

export abstract class SimpleState {
  constructor(
    protected engine: GameEngine,
    protected entity: VisualEntity,
    protected controller: StateController,
  ) {}

  action: AnimationAction | undefined;

  abstract exit(nextState: SimpleState): void;

  abstract enter(prevState: SimpleState | undefined): void;

  abstract validate(deltaTime: number): void;
}
