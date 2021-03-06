
export class Item {

    el:HTMLDivElement;
    $el:any;
    index:number;

    width:number;
    height:number;

    constructor(el:HTMLDivElement, index:number) {
        this.el = el;
        this.$el = $(el);
        this.index = index;
    }

    draw() {
    }

    resize(windowWidth:number, windowHeight:number) {

        this.width = windowWidth;
        this.height = windowHeight;

        this.$el.width(windowWidth);
        this.$el.height(windowHeight);
    }
}
