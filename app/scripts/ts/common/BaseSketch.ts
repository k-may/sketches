/**
 * Created by kev on 2016-05-18.
 */
///<reference path="../../../../typings/globals/tween.js/index.d.ts"/>
import TWEEN = require('tween');
import $ = require('jquery');

class BaseSketch {

    $el:any;
    el:HTMLElement;

    _scrollHeight:Number = -1;
    _mousePos:any;
    _tween:TWEEN.Tween;
    _windowWidth:Number = -1;
    _windowHeight:Number = -1;
    _scrollRatio:Number = 0.0;
    _invalidated:boolean = false;
    _animDuration:Number = 1000;

    id:String;

    constructor() {
        this.el = document.createElement("div");
        this.$el = $(this.el);
    }

    resize(w:number, h:number) {
        this._windowWidth = w;
        this._windowHeight = h;
        this._invalidated = true;
    }

    private invalidate() {
        this._invalidated = true;
    }

    toggle() {
        if (this._scrollRatio < 0.5) {
            this.animateIn();
        } else {
            this.animateOut();
        }
    }

    animateIn() {

        if (this._tween) {
            this._tween.stop();
        }

        this._tween = new TWEEN.Tween({value: this._scrollRatio})
            .to({value: 1}, this._animDuration)
            .onUpdate((obj) => {
                this.setScrollRatio(obj.value);
            })
            .start();
    }

    animateOut() {
        if (this._tween) {
            this._tween.stop();
        }

        this._tween = new TWEEN.Tween({value: this._scrollRatio})
            .to({value: 0}, this._animDuration)
            .onUpdate((obj) => {
                this.setScrollRatio(obj.value);
            })
            .start();
    }

    setScrollRatio(ratio:Number) {
        this._scrollRatio = ratio;
        this.invalidate();
    }

    draw(time?:Number) :any{

        if (this._invalidated) {

            this._invalidated = false;
            return true;
        }

        return false;
    }

    remove() {
        this.$el.remove();
    }

}

export = BaseSketch;