/**
 * Created by kev on 16-02-08.
 */


require.config({
  baseUrl: 'js/',
  paths: {
    'tweenjs' : '../../../app/components/tweenjs/src/Tween',
    'three': '../../../app/components/threejs/build/three.min',
    'underscore' : '../../../app/components/underscore/underscore-min',
    'objLoader' : '../OBJLoader'
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

require(['underscore', 'tweenjs','three', 'app/scripts/ts/sketches/RefractionSketch/OBJLoader', 'app/scripts/ts/sketches/RefractionSketch/sketch'], function (_, TWEEN, THREE, OBJLoader, exports) {

  //fix exports..
  window.THREE = THREE;

  var sketch;

  function init() {

    var div = document.getElementById("sketch");
    sketch = new exports.Sketch(div);

    window.onresize = resize;
    window.onmousemove = mouseMove;


    document.addEventListener( 'mousemove', mouseMove, false );

    resize();
    loop();
  }

  function mouseMove(event){

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    var mouseX = ( event.clientX - windowHalfX ) / 2;
    var mouseY = ( event.clientY - windowHalfY ) / 2;
    sketch.onMouseMove(mouseX, mouseY);
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
