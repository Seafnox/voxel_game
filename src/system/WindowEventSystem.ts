import { GameEngine } from '../engine/GameEngine';
import { System } from '../engine/System';

export const enum WindowEvent {
    Resize = 'resize',
}

export class WindowEventSystem extends System {
    constructor(
        ganeEngine: GameEngine,
        name: string,
    ) {
        super(ganeEngine, name);

        window.addEventListener('resize', event => this.emit(WindowEvent.Resize, {
            topic: WindowEvent.Resize,
            value: {
                ...event,
                view: window,
            },
        }), false);
    }

    getWindow(): WindowProxy {
        return window;
    }
}
