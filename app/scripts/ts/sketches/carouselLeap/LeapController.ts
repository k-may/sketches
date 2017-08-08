/**
 * Created by kev on 16-01-06.
 */
///<reference path="../../../typings/leapmotionTS/leapmotionts-2.2.4.d.ts"/>
///<reference path="../../ts/base_controller.ts"/>

import Leap = require("../../../typings/leapmotionTS/leapmotionts-2.2.4");
import BaseController = require("../../ts/base_controller");

class LeapController extends BaseController{

    controller:Leap.Controller;
    consoleDiv:HTMLDivElement;
    consoles:string[];
    swipe : any = {
        start : -1
    };
    listeners:any[];

    constructor(){

        super();

        this.createElements();


        this.controller = new Leap.Controller();


        this.controller.addEventListener(Leap.LeapEvent.LEAPMOTION_CONNECTED, (event:Leap.LeapEvent) => {
            this.console("connected");
            this.controller.enableGesture(Leap.Type.TYPE_SWIPE);
            this.controller.enableGesture(Leap.Type.TYPE_SCREEN_TAP);
        });

        this.controller.addEventListener(Leap.LeapEvent.LEAPMOTION_FRAME, (event:Leap.LeapEvent) => {
            this.onLeapFrame(event);
        });
    }

    createElements() {
        this.consoles = [];
        this.consoleDiv = <HTMLDivElement>document.getElementsByClassName('console')[0];

        if(!this.consoleDiv){
            this.consoleDiv = <HTMLDivElement>document.createElement("div");
            this.consoleDiv.setAttribute("class", "console");
            document.body.appendChild(this.consoleDiv);
        }

    }

    onLeapFrame(event:Leap.LeapEvent) {
        var frame:Leap.Frame = event.frame;
        var hand:Leap.Hand = null;
        if (frame.hands.length > 0) {
            hand = frame.hands[0];
        }

        if (hand) {

            var gestures:Leap.Gesture[] = frame.gestures();
            var direction:Leap.Vector3;
            for (var i = 0; i < gestures.length; i++) {

                switch (gestures[i].type) {
                    case Leap.Type.TYPE_SWIPE:
                        var swipe:Leap.SwipeGesture = <Leap.SwipeGesture>gestures[i];

                        direction = swipe.direction;
                        var absX = Math.abs(direction.x);
                        var absY = Math.abs(direction.y);

                        if (absX > absY) {

                            var time = Date.now();
                            if(time - this.swipe.start > 500 && swipe.state === Leap.State.STATE_STOP){
                                var dir:number = absX / direction.x;

                                this.console("new swipe : !" + swipe.state + " :: " + dir);

                                this.swipe.start = time;


                                //https://github.com/Microsoft/TypeScript/issues/2029
                                //casting unness!
                                var evt:CustomEvent = <CustomEvent>document.createEvent("CustomEvent");
                                evt.initCustomEvent("Swipe", true, true,{"direction" : dir} );
                                window.dispatchEvent(evt);
                            }

                        }

                        break;
                    case Leap.Type.TYPE_SCREEN_TAP:
                        var tap:Leap.ScreenTapGesture = <Leap.ScreenTapGesture>gestures[i];

                        direction = tap.direction;
                        this.console("tap : " + direction.z.toFixed(2));

                        //toggle active
                        /*if(this.currentItem.active){
                            this.currentItem.setActive(false);
                        }else{
                            this.currentItem.setActive(true);
                        }*/

                        break;

                }
            }
        }
    }

    console(message:string) {
        this.consoles.push(message + "</br>");
        if (this.consoles.length > 20) {
            this.consoles.shift();
        }
        message = "";
        this.consoles.forEach((m)=> {
            message += m;
        });
        this.consoleDiv.innerHTML = message;
    }

}

export = LeapController;