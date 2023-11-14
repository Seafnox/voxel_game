import { TopicEmitter } from 'src/emitter/TopicEmitter';
import { WindowTopic } from './WindowTopic';

export class WindowEventObserver extends TopicEmitter {
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
