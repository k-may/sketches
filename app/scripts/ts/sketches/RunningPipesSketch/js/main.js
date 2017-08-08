/**
 * Created by kev on 15-10-23.
 */

var sketch;

function init() {

	sketch = new Sketch();
	document.body.appendChild(sketch.canvas);

	window.onresize = resize;
	resize();

	loop();
}

function resize() {
	sketch.resize(window.innerWidth, window.innerHeight);
}

function loop() {

	sketch.draw();

	requestAnimationFrame(loop);
}

init();