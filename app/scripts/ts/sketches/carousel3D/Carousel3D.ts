import BaseSketch = require("../../common/BaseSketch");
import Item = require("./Item");
import AnimUtils = require("../../utils/AnimUtils");
/**
 * Created by kev on 16-01-06.
 */

    ///<reference path="../../../../../typings/globals/require/index.d.ts"/>

class Carousel3D extends BaseSketch {

    items:Item[];
    container:HTMLDivElement;
    carousel:HTMLDivElement;

    windowWidth:number = 0;
    windowHeight:number = 0;

    currentRads:number = 0;

    itemWidth:number;
    itemHeight:number;
    itemAngle:number = 40;

    currentItem:Item;

    currentAngle:number = 0;
    targetAngle:number = 0;

    constructor() {
        super();

        require(['text!ts/sketches/carousel3D/carousel3D.html'], function (html) {
            console.log(html);
        });

        this.container = <HTMLDivElement>document.getElementsByClassName('container')[0];
        this.carousel = <HTMLDivElement>document.getElementsByClassName('carousel')[0];

        this.items = [];
        var itemEls = document.getElementsByClassName('item');
        for (var i = 0; i < itemEls.length; i++) {
            var item:Item = new Item(<HTMLDivElement>itemEls[i], i);
            this.items.push(item);
        }

        window.addEventListener("Swipe", evt => {
            this.onNext(evt);
        });
    }

    onNext(evt:any) {
        var direction = evt.detail.direction;


        //update angle here!
        this.targetAngle += this.itemAngle * -direction;
    }

    draw() {

        var diff = this.targetAngle - this.currentAngle;
        this.currentAngle += diff * 0.1;

        this.drawCarousel();
    }

    drawCarousel() {
        //determine angle between items
        var rads = this.itemAngle * (Math.PI / 180);

        //rotate the carousel
        var cRot = 10;
        var cYOffset = this.itemWidth * Math.tan(cRot * Math.PI / 180);

        //determine z for items
        var z = ((this.itemWidth + 100) / 2) / Math.tan(rads / 2);
        var transformMatrix = AnimUtils.GetTranslationMatrix(-this.itemWidth / 2, cYOffset, -z);
        var rotationMatrix = AnimUtils.GetRotationMatrix(3, 0, 0);

        AnimUtils.SetTransformMatrix(this.carousel, [rotationMatrix, transformMatrix]);

        //apply transform to each
        this.items.forEach(item => {
            var r = this.itemAngle * item.index + this.itemAngle / 2 + this.currentAngle;

            var rotation = AnimUtils.GetRotationMatrix(0, r, 0);
            var translation = AnimUtils.GetTranslationMatrix(0, 0, -z);
            var rotation2 = AnimUtils.GetRotationMatrix(0, 0, cRot);
            AnimUtils.SetTransformMatrix(item.el, [rotation, translation, rotation2]);

            item.draw();
        });
    }

    resize(windowWidth, windowHeight) {

        this.windowWidth = windowWidth;
        this.windowHeight = windowHeight;

        this.itemWidth = windowWidth - 400;
        this.itemHeight = windowHeight - 400;
        this.items.forEach(item => {
            item.resize(this.itemWidth, this.itemHeight);//windowWidth, windowHeight);
        });
    }

    setCurrentItem(item:Item) {

        if (this.currentItem) {
            this.currentItem.$el.removeClass("active");
        }

        this.currentItem = item;
        this.currentItem.$el.addClass("active");
    }


}

export = Carousel3D;