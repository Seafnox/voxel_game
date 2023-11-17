import { GameEngine } from '../engine/GameEngine';
import { System } from '../engine/System';

export const enum WindowTopic {
    Resize = 'resize',
}

export type WindowResizeEvent  = UIEvent;

export class WindowEventSystem extends System {
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
