/**
 * Created by kev on 16-02-01.
 */

requirejs(['sketch'], function(exports) {

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
