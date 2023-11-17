import { GameEngine } from 'src/engine/GameEngine';
import { System } from 'src/engine/System';

export const enum KeyboardTopic {
  KeyDown = 'keyDown',
  KeyUp = 'keyUp',
}

export class KeyboardEventSystem extends System {
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
