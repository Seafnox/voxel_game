import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { StateController } from 'src/entity/state/StateController';
import { AnimationAction } from 'three';

export interface SimpleStateConstructor {
  new(
    engine: GameEngine,
    entity: Entity,
    controller: StateController,
  ): SimpleState;
}

export abstract class SimpleState {
  constructor(
    protected engine: GameEngine,
    protected entity: Entity,
    protected controller: StateController,
  ) {}

  action: AnimationAction | undefined;

  abstract exit(nextState: SimpleState): void;

  abstract enter(prevState: SimpleState | undefined): void;

  abstract validate(deltaTime: number): void;
}
