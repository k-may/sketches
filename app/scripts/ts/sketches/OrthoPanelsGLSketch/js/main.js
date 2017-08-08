/**
 * Created by kev on 16-02-08.
 */

//https://stackoverflow.com/questions/30358323/require-js-not-loading-three-js
define("three-glue", ["three"], function (three) {
  window.THREE = three;
  return three;
});

require.config({
  baseUrl: 'js/',
  paths: {
    'tweenjs' : '../../../app/components/tweenjs/src/Tween',
    'three': '../../../app/components/threejs/build/three.min',
    'underscore' : '../../../app/components/underscore/underscore-min'
  },
  map: {
    '*': {
      three: 'three-glue'
    },
    'three-glue': {
      three: 'three'
    }
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

require(['underscore', 'tweenjs', 'three', 'app/scripts/ts/sketches/OrthoPanelsGLSketch/sketch'], function (_, TWEEN, THREE, exports) {

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
