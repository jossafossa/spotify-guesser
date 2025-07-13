export class EventHandler<EventType extends Event> extends EventTarget {
  on(
    type: string,
    callback: (evt: EventType) => void,
    options?: AddEventListenerOptions | boolean
  ) {
    this.addEventListener(type, callback as EventListener, options);
  }

  off(
    type: string,
    callback: (evt: EventType) => void,
    options?: EventListenerOptions | boolean
  ) {
    this.removeEventListener(type, callback as EventListener, options);
  }
}
