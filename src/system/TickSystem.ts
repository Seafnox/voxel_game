import { GameEngine } from 'src/entity/commons/GameEngine';
import { System } from 'src/entity/commons/System';

export const enum TickSystemEvent {
  Init = 'init',
  Tick = 'tick',
}

export class TickSystem extends System {
  private prevTick: number | undefined;

  constructor(
    gameEngine: GameEngine,
    name: string
  ) {
    super(gameEngine, name);

    this.requestAnimation();
  }

  private requestAnimation() {
    requestAnimationFrame((t) => {
      if (!this.prevTick) {
        this.prevTick = t;
        this.emit<number>(TickSystemEvent.Init, t);
      }

      const deltaTime = t - this.prevTick;

      this.emit<number>(TickSystemEvent.Tick, deltaTime);

      this.prevTick = t;

      this.requestAnimation();
    });
  }
}
