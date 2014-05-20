KISSY.add('kcrop', function(S){
	var D = S.DOM, E = S.Event;
	function Kcrop(cfg){
		this.kc = S.one(cfg.container);
		this.init();
	}

	Kcrop.prototype = {
		_getSize: function(){
			var _this = this, size = {};
			size.w = D.width(_this.kc);
			size.h = D.height(_this.kc);
			return size;
		},
		_drawArea: function(start, end, offset, size){
			var _this = this;
			var delta = {x: end.x - start.x, y: end.y - start.y}, move = false, clicked = false;
			var mask = D.get(".K_cropArea", _this.kc), square = D.get(".K_cropSquare", _this.kc);
			if(!mask){
				mask = D.create('<div class="K_cropArea"></div>');
				square = D.create('<div class="K_cropSquare"></div>');
				D.append(mask, _this.kc);
				D.append(square, _this.kc);
				D.css(square, "background-image", "url(" + D.attr(D.get("img", _this.kc), "src") + ")");
			}
			var left = start.x - offset.left;
			var top = start.y - offset.top;
			D.css(mask, {"width": size.w, "height": size.h});
			D.css(square, {"left": left, "top": top, "width": delta.x, "height": delta.y, "background-position": -left + "px " + -top + "px"});
			E.on(mask, "mousedown", function(){
				clicked = true;
			});
			E.on(mask, "mousemove", function(){
				if(clicked){
					move = true;
				}
			});
			E.on(mask, "mouseup", function(){
				if(clicked){
					clicked = false;
					if(!move){
						D.remove(mask);
						D.remove(square);
					}
					move = false;
				}
			});
		},
		_render: function(size){
			var _this = this;
			var flag = false, start = {x: 0, y: 0}, offset = {left: 0, top: 0};
			E.on(_this.kc, "selectstart", function(){return false;});
			E.on(S.all("img", _this.kc), "dragstart", function(){return false;});
			E.on(_this.kc, "mousedown", function(e){
				flag = true;
				start.x = e.clientX;
				start.y = e.clientY;
				offset.left = D.offset(_this.kc).left;
				offset.top = D.offset(_this.kc).top;
			});
			E.on(_this.kc, "mousemove", function(e){
				if(flag){
					var end = {x: 0, y: 0};
					end.x = e.clientX;
					end.y = e.clientY;
					if(end.x - start.x > 0 && end.y - start.y > 0){
						_this._drawArea(start, end, offset, size);
					}else{
						if(D.get(".K_cropArea", _this.kc)){
							D.remove(D.get(".K_cropArea", _this.kc));
							D.remove(D.get(".K_cropSquare", _this.kc));
						}
					}
				}
			});
			E.on(_this.kc, "mouseup", function(){
				if(flag){
					flag = false;
				}
			});
		},
		init: function(){
			var _this = this;
			var size = _this._getSize();
			_this._render(size);
		}
	};

	S.Kcrop = Kcrop;
});