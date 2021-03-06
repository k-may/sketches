/**
 * Created by kev on 2016-05-18.
 */

export class  BaseSketch {

  $el: any;
  el: HTMLElement;

  _tween: TWEEN.Tween;
  _windowWidth: number = -1;
  _windowHeight: number = -1;
  _scrollRatio: number = 0.0;
  _invalidated: boolean = false;
  _animDuration: number = 1000;

  id: string;

  //-----------------------------------------------------------

  constructor(el? : HTMLElement) {
    this.el = el || document.createElement("div");
    this.el.setAttribute('class', 'sketch_cont');
    this.$el = $(this.el);
  }

  //-----------------------------------------------------------

  public resize(w: number, h: number) {
    this._windowWidth = w;
    this._windowHeight = h;
    this._invalidated = true;
  }

  public toggle() {
    if (this._scrollRatio < 0.5) {
      this.animateIn();
    } else {
      this.animateOut();
    }
  }

  public animateIn() {

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

  public animateOut() {
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

  public setScrollRatio(ratio: number) {
    this._scrollRatio = ratio;
    this.invalidate();
  }

  public draw(time?: number): any {

    if (this._invalidated) {

      this._invalidated = false;
      return true;
    }

    return false;
  }

  public remove() {
    this.$el.remove();
  }

  public mouseMove(e) {
  }

  public onClick(e) {
  }

  //------------------------------------------------

  private invalidate() {
    this._invalidated = true;
  }

}
