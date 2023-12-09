import { GameEngine } from 'src/engine/GameEngine';
import { EventSystem } from 'src/engine/EventSystem';

export const enum WindowTopic {
    Resize = 'resize',
}

export type WindowResizeEvent  = UIEvent;

export class WindowEventSystem extends EventSystem {
    constructor(
        ganeEngine: GameEngine,
        name: string,
    ) {
        super(ganeEngine, name);

        window.addEventListener('resize', event => this.emit<WindowResizeEvent>(WindowTopic.Resize, {
          ...event,
          view: window,
        }), false);
    }

    getWindow(): WindowProxy {
        return window;
    }
}
