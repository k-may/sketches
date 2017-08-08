/**
 * Created by kev on 15-10-23.
 */
require.config({
  baseUrl: 'js/',
  paths: {
    'three': '../../../app/components/threejs/build/three.min'
  },
  shim: {
    three: {
      exports: 'THREE'
    }
  }
});

require(['three','../mesh_sketch'], function (THREE, MeshTexture) {
  var sketch;
  window.THREE = THREE;
  console.log(THREE);
  function init() {

    sketch = new MeshTexture();
    document.body.appendChild(sketch.canvas);

    window.onresize = resize;
    resize();

    loop();
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
