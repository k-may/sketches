import {MenuView} from "./views/MenuView";
import {BaseSketch} from "./common/base_sketch";

export class MainView {

  sketch: BaseSketch;
  expander: any;
  menu: MenuView;
  sketches: any = {};
  cachedViews: any = {};
  DEFAULT_SKETCH: string;
  loaded: boolean = false;

  constructor() {
    $.getJSON('data/config.json', (data) => {
      console.log(data);
      this.loaded = true;
      this.sketches = data.sketches;
      this.start();
    });
  }

  public draw(time: number) {

    if (!this.loaded) {
      return;
    }

    if (this.sketch) {
      this.sketch.draw(time);
    }
  }

  //-------------------------------------------------------

  private start() {

    this.menu = new MenuView(this.sketches);
    document.body.appendChild(this.menu.el);

    for (var key in this.sketches) {
      this.DEFAULT_SKETCH = key;
      break;
    }

    this.setupScroll();
    this.setupWindow();
    this.onHashChange(null);
  }


  private setupScroll() {
//create scroll expander
    this.expander = document.createElement("div");
    this.expander.setAttribute("class", "expander");
    document.body.appendChild(this.expander);
  }

  private setupWindow() {
    window.onclick = this.onClick.bind(this);
    window.onresize = this.onResize.bind(this);
    window.onscroll = this.onScroll.bind(this);
    window.onhashchange = this.onHashChange.bind(this);
    window.onmousemove = this.onMouseMove.bind(this);
  }

  private onClick(e: any) {
    if (this.sketch && this.sketch.onClick)
      this.sketch.onClick(e);
  }

  private onResize(e: any) {
    if (this.sketch) {
      this.sketch.resize(window.innerWidth, window.innerHeight);
    }
  }

  private onScroll(e: any) {
  }

  private onHashChange(e: any) {
    var sketchId = location.hash.split("#")[1];
    var idValid = this.sketches.hasOwnProperty(sketchId);
    sketchId = idValid ? sketchId : this.DEFAULT_SKETCH;

    if (this.sketch) {
      if (this.sketch.id === sketchId) {
        return;
      }
      $('HTML').removeClass(this.sketch.id);

      if (this.sketch.remove)
        this.sketch.remove();
      else
        this.sketch.$el.detach();
    }

    var self = this;
    this.getClass(sketchId).then((sketch) => {
      sketch.id = sketchId;
      self.addSketch(sketch);
    });
  }

  private addSketch(sketch: BaseSketch) {
    this.sketch = sketch;

    var sketchId = this.sketch.id;
    this.cachedViews[sketchId] = this.sketch;
    this.sketch.id = sketchId;
    $('HTML').addClass(sketchId);
    document.body.appendChild(this.sketch.el);
    location.hash = "#" + sketchId;

    //update menu
    if (this.menu) {
      $("li").removeClass("active");
      document.getElementById(sketchId).setAttribute("class", "active");
    }

    this.onResize(null);
    this.onScroll(null);
  }

  private getClass(sketchId: string): Promise<any> {

    var self = this;
    return new Promise(function (resolve, reject) {
      var View = self.sketches[sketchId].View;
      if (self.cachedViews.hasOwnProperty(sketchId)) {
        resolve(self.cachedViews[sketchId]);
      } else {
        var path = "../../scripts/ts/sketches/" + View + ".js";
        require([path], exports => {

          var Class = exports;
          //make it backwards compatible with old javascript sketches...
          if (typeof Class != "function")
            Class = exports.hasOwnProperty(sketchId) ? exports[sketchId] : exports['Sketch'];

          var sketch = new Class();
          resolve(sketch);
        });
      }
    });
  }

  private onMouseMove(e: any) {
    if (this.sketch && this.sketch.mouseMove)
      this.sketch.mouseMove(e);
  }

}
