import {Item} from "./item";
import {BaseSketch} from "../../../common/base_sketch";
import {AnimUtils} from "../../../utils/anim_utils";
/**
 * Created by kev on 16-01-06.
 */


export class Sketch extends BaseSketch {

  items: Item[];
  container: HTMLDivElement;
  carousel: HTMLDivElement;

  windowWidth: number = 0;
  windowHeight: number = 0;

  currentRads: number = 0;

  itemWidth: number = 500;
  itemAngle: number = 90;

  currentItem: Item;

  currentAngle: number = 0;
  targetAngle: number = 0;

  loaded : boolean = false;

  constructor() {
    super();

    var fileref = document.createElement("link");
    fileref.rel = "stylesheet";
    fileref.type = "text/css";
    fileref.href = "styles/carousel3d.css";
    document.getElementsByTagName("head")[0].appendChild(fileref);

    require(['text!ts/sketches/CubeCarouselSketch/carousel.html'], (html) => {

      this.el.innerHTML = html;

      this.container = <HTMLDivElement>this.el.getElementsByClassName('container')[0];
      this.carousel = <HTMLDivElement>this.el.getElementsByClassName('carousel')[0];

      this.items = [];
      var itemEls = this.el.getElementsByClassName('item');
      for (var i = 0; i < itemEls.length; i++) {
        var item: Item = new Item(<HTMLDivElement>itemEls[i], i);
        this.items.push(item);
      }

      window.addEventListener("Swipe", evt => {
        this.onNext(evt);
      });

      window.addEventListener("keydown", evt => {
        if (evt.key == "ArrowLeft")
          this.targetAngle += this.itemAngle * -1;
        else if (evt.key == "ArrowRight")
          this.targetAngle += this.itemAngle;
      });

      this.loaded = true;
    });
  }

  onNext(evt: any) {
    var direction = evt.detail.direction;

    //update angle here!
    this.targetAngle += this.itemAngle * -direction;
  }

  draw() {

    if(!this.loaded)
      return;

    var diff = this.targetAngle - this.currentAngle;
    this.currentAngle += diff * 0.1;

    this.drawCarousel();
  }

  drawCarousel() {
    //determine angle between items
    var rads = this.itemAngle * (Math.PI / 180);

    //rotate the carousel
    var cRot = 10;
    var cYOffset = 0;

    //determine z for items
    var z = window.innerWidth / Math.tan(rads / 2);
    var transformMatrix = AnimUtils.GetTranslationMatrix(-window.innerWidth / 2, 0, -z);//cYOffset, -z);
    var rotationMatrix = AnimUtils.GetRotationMatrix(0, 0, 0);

    AnimUtils.SetTransformMatrix(this.carousel, [rotationMatrix, transformMatrix]);

    //apply transform to each
    this.items.forEach(item => {
      var r = this.itemAngle * item.index + this.currentAngle;

      var rotation = AnimUtils.GetRotationMatrix(0, r, 0);
      var translation = AnimUtils.GetTranslationMatrix(0, 0, -z);
      AnimUtils.SetTransformMatrix(item.el, [rotation, translation]);

      item.draw();
    });
  }

  resize(windowWidth, windowHeight) {
    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
  }

  setCurrentItem(item: Item) {

    if (this.currentItem) {
      this.currentItem.$el.removeClass("active");
    }

    this.currentItem = item;
    this.currentItem.$el.addClass("active");
  }
}
