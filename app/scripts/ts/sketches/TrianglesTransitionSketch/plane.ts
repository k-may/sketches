/**
 * Created by kevin.mayo on 7/28/2017.
 */
export class Plane{

  bottomLine: any = {l: {x: -0.5, y: 0.5}, r: {x: 0.5, y: 0.5}};
  destBottomLine: any = {l: {x: -0.5, y: 0.5}, r: {x: 0.5, y: 0.5}};

  distance : number;
  renderPlane: THREE.Geometry;

  done : boolean = false;

  counter : number = 0;
  speed : number;

  constructor(l : any, r : any, d : number){

    this.speed = 1 + Math.random();

    this.distance = d;

    this.bottomLine.l.x = this.destBottomLine.l.x = l.x;
    this.bottomLine.l.y = this.destBottomLine.l.y = l.y;

    this.bottomLine.r.x = this.destBottomLine.r.x = r.x;
    this.bottomLine.r.y = this.destBottomLine.r.y = r.y;

    this.renderPlane = new THREE.PlaneGeometry(1, 1);
    this.renderPlane.vertices.forEach((v,i)=>{
      v.y = i % 2 == 0 ? l.y : r.y;
      v.x = i % 2 == 0 ? l.x : r.x;
    });

    this.resetBottomLine();
  }

  public update(){

    if(this.done)
      return;

    this.counter += this.speed;
    var ratio = this.counter / 100.0;

    if(ratio > 1){
      ratio = 0;
      this.counter = 0;
      this.resetBottomLine();
    }

    ratio = TWEEN.Easing.Cubic.InOut(ratio);

    //lerp point
    var pt = this.lerpPoint(this.bottomLine.l, this.destBottomLine.l, ratio);
    this.renderPlane.vertices[2].x = pt.x;
    this.renderPlane.vertices[2].y = pt.y;

    pt = this.lerpPoint(this.bottomLine.r, this.destBottomLine.r, ratio);
    this.renderPlane.vertices[3].x = pt.x;
    this.renderPlane.vertices[3].y = pt.y;

    this.renderPlane.verticesNeedUpdate = true;
  }

  public resetBottomLine() {

    this.renderPlane.vertices[2].x = this.bottomLine.l.x = this.destBottomLine.l.x;
    this.renderPlane.vertices[2].y = this.bottomLine.l.y = this.destBottomLine.l.y;

    this.renderPlane.vertices[3].x = this.bottomLine.r.x = this.destBottomLine.r.x;
    this.renderPlane.vertices[3].y = this.bottomLine.r.y = this.destBottomLine.r.y;

    var target: any;
    if(Math.abs(this.destBottomLine.l.y - this.destBottomLine.r.y) < this.distance * 2) {

      var next = Math.random() > 0.5 ? "l" : "r";
      if (next == "l") {
        target = this.destBottomLine.l;
      } else {
        target = this.destBottomLine.r;
      }

    }else{
      target = this.destBottomLine.l.y < this.destBottomLine.r.y ? this.destBottomLine.r : this.destBottomLine.l;
    }

    target.y -= this.distance;

    this.done = this.bottomLine.l.y <= -2 && this.bottomLine.r.y <= -2;
  }

  lerpPoint(pt: any, destPt: any, ratio: number) {
    return {
      x: pt.x + (destPt.x - pt.x) * ratio,
      y: pt.y + (destPt.y - pt.y) * ratio
    };
  }


}
