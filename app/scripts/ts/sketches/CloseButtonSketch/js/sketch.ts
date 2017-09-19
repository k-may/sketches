import {BaseSketch} from "../../../common/base_sketch";
import {CanvasBuffer2D} from "../../../common/canvas_buffer2d";
import {AnimUtils} from "../../../utils/anim_utils";
/**
 * Created by kev on 16-02-08.
 */

class Line {

  d1: any = {x: 0, y: 0};
  s1: any = {x: 0, y: 0};
  p1: any = {x: 0, y: 0};

  d2: any = {x: 0, y: 0};
  s2: any = {x: 0, y: 0};
  p2: any = {x: 0, y: 0};

  value: number = 0;
  visible: boolean = true;

  constructor() {
    this.p1 = {x: 0, y: 0};
    this.p1 = {x: 0, y: 0};
  }

  setup(s1: any, d1: any, s2: any, d2: any) {
    this.s1 = s1;
    this.s2 = s2;
    this.d1 = d1;
    this.d2 = d2;
  }

  update() {
    this.p1 = this.lerp(this.s1, this.d1, this.value);
    this.p2 = this.lerp(this.s2, this.d2, this.value);
  }

  lerp(s: any, d: any, ratio): any {
    return {
      x: s.x + (d.x - s.x) * ratio,
      y: s.y + (d.y - s.y) * ratio
    };
  }

}

export class Sketch extends BaseSketch {

  windowWidth: number = 0;
  windowHeight: number = 0;

  divElement: HTMLElement;

  buffer: CanvasBuffer2D;

  animDirection: number = 0;

  l1: Line = new Line();
  l2: Line = new Line();
  l3: Line = new Line();
  l4: Line = new Line();

  constructor(div: HTMLElement) {
    super();

    this.buffer = new CanvasBuffer2D();
    this.el.appendChild(this.buffer.canvas);

    this.l1.setup({x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 1}, {x: 1, y: 1});

    this.l3.visible = false;

    this.l2.setup({x: 1, y: 1}, {x: 0, y: 0}, {x: 1, y: 1}, {x: 1, y: 1});
    this.l2.visible = false;

    this.l4.setup({x: 0, y: 1}, {x: 0, y: 1}, {x: 0, y: 1}, {x: 1, y: 0});
    this.l4.visible = false;

  }

  onClick() {
    if (this.animDirection == 0)
      this.animIn();
    else
      this.animOut();

    this.animDirection = 1 - this.animDirection;
  }

  animIn() {
    new TWEEN.Tween(this.l1)
      .to({value: 1}, 500)
      .start();

    new TWEEN.Tween(this.l2)
      .delay(250)
      .onStart(()=>this.l2.visible = true)
      .to({value: 1}, 500)
      .easing(TWEEN.Easing.Exponential.Out)
      .start();

    this.l3.setup({x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 1});
    this.l3.value = 0;

    new TWEEN.Tween(this.l3)
      .delay(750)
      .to({value: 1}, 500)
      .onStart(()=>this.l3.visible = true)
      .easing(TWEEN.Easing.Exponential.Out)
      .onComplete(() => {

        this.l3.setup({x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 1}, {x: 0, y: 1});
        this.l3.value = 0;

        new TWEEN.Tween(this.l3)
          .to({value: 1}, 500)
          .easing(TWEEN.Easing.Exponential.Out)
          .onComplete(() => this.l3.visible = false)
          .start();

      })
      .start();

    new TWEEN.Tween(this.l4)
      .to({value: 1}, 300)
      .delay(1250)
      .onStart(()=>{this.l4.visible = true})
      .easing(TWEEN.Easing.Exponential.Out)
      .start();
  }

  animOut() {

    new TWEEN.Tween(this.l4)
      .to({value: 0}, 200)
      .easing(TWEEN.Easing.Exponential.Out)
      .onComplete(()=> this.l4.visible = false)
      .start();

    this.l3.visible = true;
    new TWEEN.Tween(this.l3)
      .to({value: 0}, 200)
      .delay(150)
      .onComplete(() => {

        this.l3.setup({x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 0});
        this.l3.value = 0;

        new TWEEN.Tween(this.l3)
          .to({value: 1}, 200)
          .easing(TWEEN.Easing.Exponential.Out)
          .onComplete(() => this.l3.visible = false)
          .start();

      })
      .start();

    new TWEEN.Tween(this.l2)
      .to({value: 0}, 500)
      .easing(TWEEN.Easing.Exponential.Out)
      .delay(500)
      .start();

    new TWEEN.Tween(this.l1)
      .to({value: 0}, 1000)
      .delay(600)
      .easing(TWEEN.Easing.Exponential.Out)
      .start();
  }

  draw(time: number) {

    this.buffer.clear();

    this.l1.update();
    this.l2.update();
    this.l3.update();
    this.l4.update();

    this.buffer.ctx.lineCap = "round";
    this.buffer.ctx.beginPath();
    this.buffer.ctx.strokeStyle = "0x000000";
    this.buffer.ctx.lineWidth = 10;

    if (this.l1.visible)
      this.drawLn(this.l1);

    if (this.l2.visible)
      this.drawLn(this.l2);

    if (this.l3.visible)
      this.drawLn(this.l3);

    if (this.l4.visible)
      this.drawLn(this.l4);

    this.buffer.ctx.stroke();

  }

  drawLn(line: Line) {

    var padding = 10;
    var width = this.buffer.width - padding * 2;
    var height = this.buffer.height - padding * 2;

    this.buffer.ctx.moveTo(line.p1.x * width + padding, line.p1.y * height + padding);
    this.buffer.ctx.lineTo(line.p2.x * width + padding, line.p2.y * height + padding);
  }

  resize(windowWidth, windowHeight) {
    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;

    this.buffer.resize(windowWidth * 0.5, windowHeight * 0.5);

    AnimUtils.SetTransformMatrix(this.buffer.canvas, AnimUtils.GetTranslationMatrix(windowWidth * 0.25, windowHeight * 0.25));
  }

}
