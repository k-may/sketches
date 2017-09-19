import {BaseSketch} from "../../common/base_sketch";
import {AnimUtils} from "../../utils/anim_utils";
/**
 * Created by Kevin on 2015-11-08.
 */

export class Div {
  div: HTMLElement;
  x: number = 0;
  y: number = 0;

  constructor(div: HTMLDivElement) {
    this.div = div;
  }
}

export class Sketch extends BaseSketch {

  ratio: number = 0;
  divs: Div[];
  invalidated: Boolean = false;
  targetRatio: number = 0;

  constructor(div: HTMLDivElement) {
    super();

    var fileref = document.createElement("link");
    fileref.rel = "stylesheet";
    fileref.type = "text/css";
    fileref.href = "styles/carousel2d.css";
    document.getElementsByTagName("head")[0].appendChild(fileref)

    this.divs = [];
    var num = 100;
    var height = window.innerHeight / num;

    for (var i = 0; i < num; i++) {
      var div = document.createElement('div');
      div.setAttribute("class", "sketch");
      var offset = i * height;
      div.style.height = height + "px";
      this.el.appendChild(div);
      this.divs.push(new Div(div));
    }
  }

  draw(time: number): void {
    super.draw(time);

    this.invalidated = false;

    var diff = (this.targetRatio - this.ratio);
    if (Math.abs(diff) > 0.001) {
      this.invalidated = true;
    }
    this.ratio += diff * 0.1;

    var previous = null;
    var div = this.divs[0];
    var xPos = (this.ratio * window.innerWidth);
    var yPos = 10 + Math.sin(this.ratio * Math.PI * 2) * 100 - this.ratio * 120;
    div.x = xPos;
    div.y = yPos;

    this.divs.forEach((div, index) => {
      this.drawDiv(div, this.ratio, previous);
      previous = div;
    });
  }

  drawDiv(div: Div, ratio, previous) {
    if (previous) {
      div.x = div.x + (previous.x - div.x) * 0.4;
      div.y = previous.y + 0.01;
    }
    AnimUtils.SetMatrix(div.div, 0, (90 * ratio), 0, 1, div.x, div.y, 0);
  }

  mouseMove(e) {
    this.setRatio(Math.min(0.5, Math.max(0, (e.clientX + 10) / (window.innerWidth - 10))));
  }

  setRatio(ratio: number) {
    this.targetRatio = ratio;
    this.invalidated = true;
  }
}
