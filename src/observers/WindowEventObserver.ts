import { Emittable } from '../emitter/Emittable';
import { WindowTopic } from './WindowTopic';

export class WindowEventObserver extends Emittable {
  constructor() {
    super();

    window.addEventListener('resize', event => this.emit(WindowTopic.Resize, {
      topic: WindowTopic.Resize,
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
