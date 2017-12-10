/**
 * Created by kev on 16-01-06.
 */
import {BaseController} from "../../common/base_controller";
import {Controller, Frame, Gesture, Hand, LeapEvent, ScreenTapGesture, SwipeGesture, Vector3} from "leapmotionts";

class LeapController extends BaseController{

    controller:Controller;
    consoleDiv:HTMLDivElement;
    consoles:string[];
    swipe : any = {
        start : -1
    };
    listeners:any[];

    constructor(){

        super();

        this.createElements();


        this.controller = new Controller();


        this.controller.addEventListener(LeapEvent.LEAPMOTION_CONNECTED, (event:LeapEvent) => {
            this.console("connected");
            this.controller.enableGesture(Gesture.TYPE_SWIPE);
            this.controller.enableGesture(Gesture.TYPE_SCREEN_TAP);
        });

        this.controller.addEventListener(LeapEvent.LEAPMOTION_FRAME, (event:LeapEvent) => {
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

    onLeapFrame(event:LeapEvent) {
        var frame:Frame = event.frame;
        var hand:Hand = null;
        if (frame.hands.length > 0) {
            hand = frame.hands[0];
        }

        if (hand) {

            var gestures:Gesture[] = frame.gestures();
            var direction:Vector3;
            for (var i = 0; i < gestures.length; i++) {

                switch (gestures[i].type) {
                    case Gesture.TYPE_SWIPE:
                        var swipe:SwipeGesture = <SwipeGesture>gestures[i];

                        direction = swipe.direction;
                        var absX = Math.abs(direction.x);
                        var absY = Math.abs(direction.y);

                        if (absX > absY) {

                            var time = Date.now();
                            if(time - this.swipe.start > 500 && swipe.state === Gesture.STATE_STOP){
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
                    case Gesture.TYPE_SCREEN_TAP:
                        var tap:ScreenTapGesture = <ScreenTapGesture>gestures[i];

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
