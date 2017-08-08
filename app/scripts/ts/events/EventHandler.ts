export interface IEvent {
  eventType : string;
  dispatch();
}

export interface  EventHandler {
    (event:IEvent) : void;
}
