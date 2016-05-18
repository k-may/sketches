/**
 * Created by kev on 15-07-16.
 */
/**
 * ...
 * @author emlyn@resn.co.nz
 */

require.config({

	paths:{
		'jquery' : 'components/jQuery/dist/jquery.min',
		'tween' : 'components/tween.js/src/Tween',
		'underscore' : 'components/underscore/underscore-min'
	},

	shim:{
		'underscore' : {
			'exports' : '_'
		},
		'tween' : {
			'exports' : 'TWEEN'
		}
	},

	waitSeconds:0

});

define("modernizr",function () {
	return window.Modernizr;
});

//# Start loading main entrypoint
require(["ts/MainView"],function (MainView) {
	var mainView = new MainView();
});