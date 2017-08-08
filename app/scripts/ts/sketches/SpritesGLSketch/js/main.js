/**
 * Created by kev on 16-02-08.
 */
require.config({
  baseUrl: 'js/',
  paths: {
    'tweenjs' : '../../../app/components/tweenjs/src/Tween',
    'three': '../../../app/components/threejs/build/three.min',
    'underscore' : '../../../app/components/underscore/underscore-min'
  },
  shim: {
    three: {
      exports: 'THREE'
    },
    underscore : {
      exports : '_'
    },
    tweenjs : {
      exports : 'TWEEN'
    }
  }

});

require(['underscore', 'tweenjs', 'three','sketch'], function (_, TWEEN, THREE, exports) {

  //fix exports..
  window.THREE = THREE;

  var sketch;

  function init() {

    var div = document.getElementById("sketch");
    sketch = new exports.Sketch(div);

    window.onresize = resize;
    window.onmousemove = mouseMove;

    resize();
    loop();
  }

  function mouseMove(e){

  }

  function resize() {
    sketch.resize(window.innerWidth, window.innerHeight);
  }

  function loop() {
    var time = Date.now();
    sketch.draw(time);
    requestAnimationFrame(loop);
  }

  init();
});
