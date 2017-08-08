
/**
 * Created by kev on 15-07-24.
 */

define(['base_sketch','rsvp',"jquery"],function (BaseSketch,RSVP,$) {

    return BaseSketch.extend({

        imgSrc:['red_bar.png', 'LANDING_SECTION.png','LANDING_SECTION_climaheat.png','LANDING_SECTION_cold.png','LANDING_SECTION_forget.png','LANDING_SECTION_forget_distressed.png','LANDING_SECTION_overlay.png'],
        img   :[],

        loaded     :false,
        invalidated:false,

        backgroundCont:null,
        titleCont     :null,
        titleTop      :null,
        titleMid      :null,
        titleBottom   :null,
        overlay       :null,


        initialize:function () {
            this.createElements();
        },

        createElements:function () {

            this.backgroundImgCont = document.createElement("div");
            this.backgroundImgCont.setAttribute("class","landing_background");
            this.el.appendChild(this.backgroundImgCont);

            this.titleCont = document.createElement("div");
            this.titleCont.setAttribute("class","landing_title");
            this.el.appendChild(this.titleCont);

            this.titleTop = document.createElement("div");
            this.titleTop.setAttribute("class","landing_title-top");
            this.titleCont.appendChild(this.titleTop);

            this.titleMid = document.createElement("div");
            this.titleMid.setAttribute("class","landing_title-mid");
            this.titleCont.appendChild(this.titleMid);

            this.titleBottom = document.createElement("div");
            this.titleBottom.setAttribute("class","landing_title-bottom");
            this.titleCont.appendChild(this.titleBottom);

        },

        removeElements : function(){

            //this.titleCont.removeChild(this.titleBottom);
            this.el.removeChild(this.backgroundImgCont);
            this.el.removeChild(this.titleCont);

        },

        getImageBySrc:function (src) {
            for (var i = 0; i < this.img.length; i++) {
                if (this.img[i].src.indexOf(src) !== -1) {
                    return this.img[i];
                }
            }
        }


    })


})
;