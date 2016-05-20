/**
 * Created by kev on 15-07-16.
 */

// Include a performance.now polyfill
(function () {

	if ('performance' in window === false) {
		window.performance = {};
	}

	// IE 8
	Date.now = (Date.now || function () {
		return new Date().getTime();
	});

	if ('now' in window.performance === false) {
		var offset = window.performance.timing && window.performance.timing.navigationStart ? window.performance.timing.navigationStart
			: Date.now();

		window.performance.now = function () {
			return Date.now() - offset;
		};
	}

})();

require.config({

	paths:{
		'jquery' : 'components/jQuery/dist/jquery.min',
		'tweenjs' : 'components/tween.js/src/Tween',
		'underscore' : 'components/underscore/underscore-min',
		'modernizr' : 'components/modernizr/bin/modernizr',
		'handlebars' : 'components/handlebars/handlebars.min',
		'text' : 'components/text/text'
	},

	shim:{
		'underscore' : {
			'exports' : '_'
		},
		'tweenjs' : {
			'exports' : 'TWEEN'
		}
	},

	waitSeconds:0

});

define("modernizr",function () {
	return window.Modernizr;
});

//# Start loading main entrypoint
require(["ts/MainView", "tweenjs"],function (MainView, TWEEN) {
	var mainView = new MainView();

	function draw(){
		window.requestAnimationFrame(draw);

		var time = window.performance.now();
		TWEEN.update(time);
		mainView.draw(time);

	}
	draw();


});