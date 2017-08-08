/**
 * Created by kev on 15-07-16.
 */
/**
 * ...
 * @author emlyn@resn.co.nz
 */

require.config({

    paths:{
        "jquery"      :"libs/jquery-2.1.3",
        "underscore"  :"libs/underscore",
        "backbone"    :"libs/backbone",
        "swfobject"   :"libs/swfobject",
        "handlebars"  :"libs/handlebars-v3.0.0",
        "text"        :"libs/text",
        "TweenMax"    :'libs/greensock/TweenMax.min',
        "TweenLite"   :'libs/greensock/TweenLite.min',
        "TimelineLite":'libs/greensock/TimelineLite.min',
        "TimelineMax" :'libs/greensock/TimelineMax.min',
        "console"     :"util/debugger",
        "modernizr"   :"empty:",
        "noise"       :"libs/perlin",
        //it's a wrapper because shimming it won't work with soundjs8.0
        "createjs"    :'shims/shim_createjs',
        "sylvester"   :'libs/sylvester-min',

        "libs/createjs/preloadjs":"libs/createjs/preloadjs-0.6.0.combined",
        "libs/createjs/tweenjs"  :"libs/createjs/tweenjs-0.6.0.min",
        "libs/createjs/easeljs"  :"libs/createjs/easeljs-0.8.0.min",
        "libs/createjs/movieclip":"libs/createjs/movieclip-0.8.0.min",
        "libs/createjs/soundjs"  :"libs/createjs/soundjs-0.6.0.min",

        "rsvp":"libs/rsvp/rsvp.min"
    },

    shim:{

        'noise' : {
            exports : 'noise'
        },

        'sylvester':{
            exports:'$M'
        },
        'rsvp'     :{
            exports:'RSVP'
        },

        'libs/console-shim':{
            exports:'console'
        },

        'jquery':{
            exports:'jQuery'

        },

        "libs/createjs/movieclip":{
            deps:["libs/createjs/easeljs","libs/createjs/tweenjs"]
        },

        'libs/createjs/tweenjs':{
            exports:'createjs.Tween',
            deps   :['libs/createjs/easeljs']
        },

        'libs/device':{

            exports:'device'
        },

        'underscore':{
            exports:'_'
        },
        'backbone'  :{
            deps   :['underscore','jquery'],
            exports:'Backbone'

        },
        'handlebars':{

            exports:'handlebars'
        },
        'console'   :{
            exports:'console'
        },


    },

    waitSeconds:0

});

define("modernizr",function () {
    return window.Modernizr;
});

//# Start loading main entrypoint
require(["main"],function (Main) {
    Main.start();
});