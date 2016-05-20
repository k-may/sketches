/**
 * Created by kev on 2016-05-19.
 */
import IEvent = require("../events/IEvent");
import EventHandler = require("../events/EventHandler");
/**
 * Created by kev on 16-01-06.
 */

class BaseController{

    private eventQueue:IEvent[] = [];
    private eventHandlers:any = {};

    constructor(){

    }

    dispatch(event:IEvent) {
        setTimeout(() => {
            this.eventQueue.push(event);
        }, 1);
    }

    digestEventQueue() {

        try {
            var _this = this;
            this.eventQueue.forEach(event => {
                if (_this.eventHandlers[event.eventType]) {
                    _this.eventHandlers[event.eventType].forEach(handler => {
                        handler.call(_this, event); //(event);
                    });
                }
            });

        } catch (e) {
            console.error(e);
            console.log(e.stack);
        }

        this.eventQueue = [];
    }

    listenTo(type:string, handler:EventHandler):void {
        if (
            !this.eventHandlers[type]
        ) {
            this.eventHandlers[type] = [];
        }

        this.eventHandlers[type].push(handler);
    }

    update():void {
        this.digestEventQueue();
    }
}

export = BaseController;