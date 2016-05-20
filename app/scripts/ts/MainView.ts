/**
 * Created by kev on 2016-05-18.
 */

///<reference path="../../../typings/globals/require/index.d.ts"/>
///<reference path="../../../typings/globals/es6-shim/index.d.ts"/>

import $ = require('jquery');
import BaseSketch = require("./common/BaseSketch");
import MenuView = require("./views/MenuView");

class MainView {

    sketch:BaseSketch;
    expander:any;
    menu:MenuView;
    sketches:any = {};
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

        this.menu = new MenuView(this.sketches);
        document.body.appendChild(this.menu.el);

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
        if(this.sketch){
            this.sketch.resize(window.innerWidth, window.innerHeight);
        }
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

        var self = this;
        this.getClass(sketchId).then((sketch) => {
            sketch.id = sketchId;
            self.addSketch(sketch);
        });
        
    }

    addSketch(sketch:BaseSketch){
        this.sketch = sketch;

        var sketchId = this.sketch.id;
        this.cachedViews[sketchId] = this.sketch;
        this.sketch.id = sketchId;
        $('HTML').addClass(sketchId);
        document.body.appendChild(this.sketch.el);
        location.hash = "#" + sketchId;

        //update menu
        if(this.menu) {
            $("li").removeClass("active");
            document.getElementById(sketchId).setAttribute("class", "active");
        }

        this.onResize(null);
        this.onScroll(null);
    }
    
    getClass(sketchId:string):Promise<any> {

        var self = this;
        return new Promise(function (resolve, reject) {
            var View = self.sketches[sketchId].View;
            if (self.cachedViews.hasOwnProperty(sketchId)) {
                resolve(self.cachedViews[sketchId]);
            } else {
                var path = "../../scripts/ts/sketches/" + View + ".js";
                require([path], function (Class) {
                    var sketch = new Class();
                    resolve(sketch);
                });
            }

        });
    }

    onMouseMove(e:any) {

    }

    draw(time:number) {

        if (!this.loaded) {
            return;
        }

        if (this.sketch) {
            this.sketch.draw(time);
        }

    }


}

export = MainView;