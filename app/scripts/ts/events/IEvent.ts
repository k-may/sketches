/**
 * Created by kev on 2016-05-19.
 */

interface IEvent {
    eventType : string;
    dispatch();
}
export = IEvent;