/**
 * Created by kev on 15-07-16.
 */
define(['backbone',
        'ellis/ellis_sketch',
        'details_transition_1/details_transition_sketch_1',
        'details_transition_2/details_transition_sketch_2',
        'details_transition_3/details_transition_sketch_3',
        'details_transition_4/details_transition_sketch_4',
        'details_images_1/details_images_sketch',
        'details_images_2/details_images_sketch',
        'details_background/details_background_sketch',
        'details_background_gl/details_background_gl_sketch',
        'details_background_mouse/details_background_mouse_sketch',
        'landing_sketch/landing_sketch',
        'snow/snow_sketch',
        'snow_2/snow_sketch_2',
        'rain/rain_sketch',
        'forget/forget_sketch',
        'forget_2/forget_sketch_2',
        'transition_2/transition_2_sketch',
        'transition_1/transition_1_sketch'
    ],

    function (Backbone,
        EllisSketch,
        DetailsTransitionSketch1,
        DetailsTransitionSketch2,
        DetailsTransitionSketch3,
        DetailsTransitionSketch4,
        DetailsImagesSketch1,
        DetailsImagesSketch2,
        DetailsBackgroundSketch,
        DetailsBackgroundGLSketch,
        DetailsBackgroundMouseSketch,
        LandingsSketch,
        SnowSketch,
        SnowSketch2,
        RainSketch,
        ForgetSketch,
        ForgetSketch2,
        Transition2Sketch,
        Transition1Sketch) {


        var Main = Backbone.View.extend({

            expander         :null,
            scrollHeight     :-1,
            $window          :null,
            sketch           :null,
            targetScrollRatio:0,
            scrollRatio      :0,
            invalidated      :false,
            //todo create base sketch view class
            sketches         :{
                "ellis":{
                    View:EllisSketch
                },

                /*"details 1"               :{
                    View:DetailsTransitionSketch1
                }
                ,
                "details 2"               :{
                    View:DetailsTransitionSketch2
                }
                ,
                "details 3"               :{
                    View:DetailsTransitionSketch3
                }
                ,*/
                "details transition"      :{
                    View:DetailsTransitionSketch4
                },
                /*,
                'details images 1'        :{
                    View:DetailsImagesSketch1
                }
                ,*/
                'details images'          :{
                    View:DetailsImagesSketch2
                }
                ,
                'details background'      :{
                    View:DetailsBackgroundSketch
                }
                ,
                'details background gl'   :{
                    View:DetailsBackgroundGLSketch
                }
                ,
                'details background mouse':{
                    View:DetailsBackgroundMouseSketch
                }
                ,
                'landings sketch'         :{
                    View:LandingsSketch
                }
                ,
                'snow'                    :{
                    View:SnowSketch
                },
                'snow2'                    :{
                    View:SnowSketch2
                },
                'rain'                    :{
                    View:RainSketch
                },
                'forget'                  :{
                    View:ForgetSketch
                },
                'forget 2'                  :{
                    View:ForgetSketch2
                },
                'transition 1'            :{
                    View:Transition1Sketch
                },
                'transition 2'            :{
                    View:Transition2Sketch
                }
            }
            ,
            DEFAULT_SKETCH   :"landings sketch",
            cachedViews      :{}
            ,

            start:function () {


                var _this = this;

                function loop() {

                    window.requestAnimationFrame(loop);

                    if (_this.invalidated) {
                        if (_this.sketch && _this.sketch.setScrollRatio) {

                            _this.scrollRatio += (_this.targetScrollRatio - _this.scrollRatio) * 0.09;

                            if (Math.abs(_this.scrollRatio - _this.targetScrollRatio) > 0.001) {
                                _this.invalidated = true;
                            } else {
                                _this.scrollRatio = _this.targetScrollRatio;
                                _this.invalidated = false;
                            }

                            _this.sketch.setScrollRatio(_this.scrollRatio);
                        }
                    }

                    if (_this.sketch && _this.sketch.draw) {

                        _this.sketch.draw(Date.now());
                    }
                }

                function onResize() {

                    var ratio = _this.sketch.heightRatio || 3;
                    _this.scrollHeight = (window.innerHeight * ratio);

                    if (_this.sketch && _this.sketch.resize) {
                        _this.sketch.resize(window.innerWidth,window.innerHeight);
                    }

                    if (_this.sketch && _this.sketch.setScrollHeight) {
                        _this.sketch.setScrollHeight(_this.scrollHeight);
                    }
                    _this.expander.style.height = _this.scrollHeight + "px";
                    _this.expander.style.width = window.innerWidth + "px";

                }

                function onScroll() {
                    var scrollTop = _this.$window.scrollTop();
                    _this.sketch.scrollTop = scrollTop;
                    _this.targetScrollRatio = Math.min(1,Math.max(0,_this.$window.scrollTop() / (_this.scrollHeight - window.innerHeight)));
                    _this.invalidated = true;
                    /*if (_this.sketch && _this.sketch.setScrollRatio) {
                        _this.sketch.setScrollRatio(ratio);
                    }*/
                }

                function onHashChange() {
                    var sketchId = location.hash.split("#")[1];

                    var idValid = _this.sketches.hasOwnProperty(sketchId);
                    sketchId = idValid ? sketchId : _this.DEFAULT_SKETCH;


                    if (_this.sketch) {

                        if (_this.sketch.id === sketchId) {
                            return;
                        }

                        _this.sketch.remove();
                    }

                    var View = _this.sketches[sketchId].View;
                    if (_this.cachedViews.hasOwnProperty(sketchId)) {
                        _this.sketch = _this.cachedViews[sketchId];
                    } else {
                        _this.sketch = new View();
                    }

                    _this.cachedViews[sketchId] = _this.sketch;
                    _this.sketch.id = sketchId;
                    document.body.appendChild(_this.sketch.el);
                    location.hash = "#" + sketchId;

                    //update menu
                    $("li").removeClass("active");
                    document.getElementById(sketchId).setAttribute("class","active");

                    onResize();
                    onScroll();

                }

                this.$window = $(window);

                //create scroll expander
                this.expander = document.createElement("div");
                this.expander.setAttribute("class","expander");
                document.body.appendChild(this.expander);

                //create menu
                var menu = document.createElement("ul");
                for (var key in this.sketches) {
                    var item = document.createElement("li");
                    item.setAttribute("id",key);
                    item.innerHTML = key;
                    menu.appendChild(item);
                }
                document.body.appendChild(menu);
                menu.onclick = function (e) {
                    //console.log(e);
                    location.hash = "#" + e.target.innerHTML;
                }

                function onClick() {
                    if (_this.sketch && _this.sketch.toggle) {
                        _this.sketch.toggle();
                    }
                }

                function onMouseMove(e) {

                    var mousePos = {
                        x:e.clientX,
                        y:e.clientY
                    };

                    if (_this.sketch && _this.sketch.setMousePos) {
                        _this.sketch.setMousePos(mousePos);
                    }
                }

                window.ontouchup = onClick;
                window.onclick = onClick;
                window.onresize = onResize;
                window.onscroll = onScroll;
                window.onhashchange = onHashChange;
                window.onmousemove = onMouseMove;

                onHashChange();

                loop();
            }
            ,


        });


        return new Main();

    })