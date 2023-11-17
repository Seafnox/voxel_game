import { GameEngine } from 'src/engine/GameEngine';
import { System } from 'src/engine/System';

export const enum MouseTopic {
  MouseUp = 'mouseup',
}

export class MouseEventSystem extends System {
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
