import { GameEngine } from 'src/engine/GameEngine';
import { EventSystem } from 'src/engine/EventSystem';

export const enum TickSystemEvent {
  Init = 'init',
  Tick = 'tick',
}

export class TickSystem extends EventSystem {
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
