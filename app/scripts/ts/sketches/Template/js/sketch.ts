/**
 * Created by kev on 16-02-08.
 */
import {BaseSketch} from "../../../common/base_sketch";

export class Sketch extends BaseSketch {

  windowWidth: number = 0;
  windowHeight: number = 0;

  constructor(div: HTMLElement) {
    super(div);
  }

  draw(time: number) {
  }

  resize(windowWidth, windowHeight) {
    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
  }

}
