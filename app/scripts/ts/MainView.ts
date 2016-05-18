/**
 * Created by kev on 2016-05-18.
 */

///<reference path="../../../typings/globals/require/index.d.ts"/>

import $ = require('jquery');
import BaseSketch = require("./common/BaseSketch");

class MainView {

    sketch:BaseSketch;
    expander:any;
    menu:any;
    sketches:any;
    cachedViews:any = {};
    DEFAULT_SKETCH:string;
    loaded:boolean = false;

    constructor() {
        console.log("here we go again!");

        $.getJSON('data/config.json', (data) => {
            console.log(data);
            this.loaded = true;
            this.sketches = data.sketches;
            this.start();
        });
    }

    start() {

        for (var key in this.sketches) {
            this.DEFAULT_SKETCH = key;
            break;
        }
        //create scroll expander
        this.expander = document.createElement("div");
        this.expander.setAttribute("class", "expander");
        document.body.appendChild(this.expander);

        window.onclick = this.onClick.bind(this);
        window.onresize = this.onResize.bind(this);
        window.onscroll = this.onScroll.bind(this);
        window.onhashchange = this.onHashChange.bind(this);
        window.onmousemove = this.onMouseMove.bind(this);

        this.onHashChange(null);

    }

    createMenu() {

    }

    onClick(e:any) {

    }

    onResize(e:any) {

    }

    onScroll(e:any) {

    }

    onHashChange(e:any) {
        var sketchId = location.hash.split("#")[1];

        var idValid = this.sketches.hasOwnProperty(sketchId);
        sketchId = idValid ? sketchId : this.DEFAULT_SKETCH;

        if (this.sketch) {

            if (this.sketch.id === sketchId) {
                return;
            }

            $('HTML').removeClass(this.sketch.id);
            this.sketch.remove();
        }

        var View = this.sketches[sketchId].View;
        if (this.cachedViews.hasOwnProperty(sketchId)) {
            this.sketch = this.cachedViews[sketchId];
        } else {
            var Class:any = require("ts/sketches/" + View);
            this.sketch = new Class();
        }

        this.cachedViews[sketchId] = this.sketch;
        this.sketch.id = sketchId;
        $('HTML').addClass(sketchId);
        document.body.appendChild(this.sketch.el);
        location.hash = "#" + sketchId;

        //update menu
        $("li").removeClass("active");
        document.getElementById(sketchId).setAttribute("class", "active");

        this.onResize(null);
        this.onScroll(null);
    }

    onMouseMove(e:any) {

    }

    draw(time:Number) {

        if (!this.loaded) {
            return;
        }

        if (this.sketch) {
            this.sketch.draw(time);
        }

    }


}

export = MainView;