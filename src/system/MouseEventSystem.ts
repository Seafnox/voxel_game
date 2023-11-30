import { GameEngine } from 'src/engine/GameEngine';
import { EventSystem } from 'src/engine/EventSystem';

export const enum MouseTopic {
  MouseUp = 'mouseup',
}

export class MouseEventSystem extends EventSystem {
  constructor(
    engine: GameEngine,
    name: string,
  ) {
    super(engine, name);

    document.addEventListener('mouseup', this.onMouseUp.bind(this), false);
  }

  private onMouseUp(event: MouseEvent) {
    this.emit(MouseTopic.MouseUp, event);
  }
}
