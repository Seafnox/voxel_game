import { SimpleEmitter, Listener, Disposable } from 'src/emitter/SimpleEmitter';

export class TopicEmitter {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  private topics: Record<string, SimpleEmitter<any>> = {};

  getTopic<TEventData>(topicName: string): SimpleEmitter<TEventData> {
    if (!this.topics[topicName]) {
      this.topics[topicName] = new SimpleEmitter<TEventData>();
    }

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.topics[topicName];
  }

  public emit<TEventData>(topicName: string, event: TEventData): void {
    this.getTopic<TEventData>(topicName).emit(event);
  }

  public off<TEventData>(topicName: string, listener: Listener<TEventData>): void {
    this.getTopic<TEventData>(topicName).off(listener);
  }

  public on<TEventData>(topicName: string, listener: Listener<TEventData>): Disposable {
    return this.getTopic<TEventData>(topicName).on(listener);
  }

  public once<TEventData>(topicName: string, listener: Listener<TEventData>): void {
    this.getTopic<TEventData>(topicName).once(listener);
  }
}
