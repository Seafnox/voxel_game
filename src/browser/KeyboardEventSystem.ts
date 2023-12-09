import { GameEngine } from 'src/engine/GameEngine';
import { EventSystem } from 'src/engine/EventSystem';

export const enum KeyboardTopic {
  KeyDown = 'keyDown',
  KeyUp = 'keyUp',
}

export class KeyboardEventSystem extends EventSystem {
  constructor(
    engine: GameEngine,
    name: string,
  ) {
    super(engine, name);

    document.addEventListener('keydown', this.onKeyDown.bind(this), false);
    document.addEventListener('keyup', this.onKeyUp.bind(this), false);
  }


  private onKeyDown(event: KeyboardEvent) {
    this.emit(KeyboardTopic.KeyDown, event);
  }

  private onKeyUp(event: KeyboardEvent) {
    this.emit(KeyboardTopic.KeyUp, event);
  }

}
