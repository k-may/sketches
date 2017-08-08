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

//https://stackoverflow.com/questions/30358323/require-js-not-loading-three-js
define("three-glue", ["three"], function (three) {
  window.THREE = three;
  return three;
});

require.config({

  paths: {
    'jquery': 'components/jQuery/dist/jquery.min',
    'tweenjs': 'components/tween.js/src/Tween',
    'underscore': 'components/underscore/underscore-min',
    'modernizr': 'libs/modernizr',
    'handlebars': 'components/handlebars/handlebars.min',
    'text': 'components/text/text',
    'three': 'components/three.js/build/three.min'
  },

  shim: {
    'underscore': {
      'exports': '_'
    },
    'tweenjs': {
      'exports': 'TWEEN'
    },
    'jquery': {
      'exports': "$"
    },
    'three' : {
      'exports' : "THREE"
    },

    map: {
      '*': {
        three: 'three-glue'
      },
      'three-glue': {
        three: 'three'
      }
    },
  },

  waitSeconds: 0

});

define("modernizr", function () {
  return window.Modernizr;
});

//# Start loading main entrypoint
require(["three", "underscore", "jquery", "ts/MainView", "tweenjs"],

  function (THREE, _, $, exports, TWEEN) {

    'use strict';

    window.THREE = THREE;
    window.$ = $;
    window._ = _;

    var mainView = new exports.MainView();

    function draw() {
      window.requestAnimationFrame(draw);

      var time = window.performance.now();
      TWEEN.update(time);
      mainView.draw(time);

    }

    draw();


  });
