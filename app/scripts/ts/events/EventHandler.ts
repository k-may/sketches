/**
 * Created by kev on 2016-05-19.
 */
import IEvent = require("./IEvent");

interface  EventHandler {
    (event:IEvent) : void;
}
export = EventHandler;