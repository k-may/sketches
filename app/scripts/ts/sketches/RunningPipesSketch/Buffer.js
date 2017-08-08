/**
 * Created by kev on 15-10-23.
 */

var Buffer = (function(){

	function Buffer(){
		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d");
		this.width = 0;
		this.height = 0;
	}
	Buffer.prototype = {

		clear : function(){
			this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
		},
		resize : function(w, h){
			if(this.canvas.width !== w || this.canvas.height !== h){
				this.canvas.width = this.width = w;
				this.canvas.height = this.height = h;
			}
		}

	};
	return Buffer;
})();