KISSY.add('moveyourmouse', function(S){
	var D = S.DOM, E = S.Event;

	function MoveYourMouse(cfg){
		this.ele = S.one(cfg.ele);
		this.ep = D.parent(this.ele, ".fullwidth");
		this.vw = D.viewportWidth();
		this.vh = D.viewportHeight();
		this.ow = D.outerWidth(this.ele);
		this.oh = D.outerHeight(this.ele);
		this.mw = this.ow - this.vw;
		this.mh = this.oh - this.vh;
		this.perX = this.mw / this.vw;
		this.perY = this.mh / this.vh;
		this.init();
	}

	MoveYourMouse.prototype = {
		_render: function(){
			var _this = this;
			E.on(_this.ep, "mousemove", function(e){
				var mouse = {x: e.clientX, y: e.clientY};
				var pos = {left: mouse.x * _this.perX, top: mouse.y * _this.perY};
				D.css(_this.ele, {"left": -pos.left, "top": -pos.top});
			});
		},
		_resize: function(){
			var _this = this;
			_this.vw = D.viewportWidth();
			_this.vh = D.viewportHeight();
			_this.mw = _this.ow - _this.vw;
			_this.mh = _this.oh - _this.vh;
			_this.perX = _this.mw / _this.vw;
			_this.perY = _this.mh / _this.vh;
			D.css(_this.ep, {"width": _this.vw, "height": _this.vh});
		},
		init: function(){
			var _this = this;
			D.css(_this.ep, {"width": _this.vw, "height": _this.vh});
			D.css(_this.ele, {"left": -_this.mw / 2, "top": -_this.mh / 2});
			E.on(window, "resize", function(){
				_this._resize();
			});
			_this._render();
		}
	};

	S.MoveYourMouse = MoveYourMouse;
});

KISSY.add("moveeles", function(S){
	var D = S.DOM, E = S.Event;

	function MoveEles(cfg){
		this.box = S.one(cfg.box);
		this.eles = S.all(cfg.eles);
		this.delta = cfg.delta || 0.3;
		this.init();
	}

	MoveEles.prototype = {
		_getStyle: function(node, property){
            if(node.style[property]){
                return node.style[property];
			}else if(node.currentStyle){
                return node.currentStyle[property];
            }else if(document.defaultView && document.defaultView.getComputedStyle){
                var style = document.defaultView.getComputedStyle(node, null);
                return style.getPropertyValue(property);
            }
            return null;
        },
		_render: function(){
			var _this = this;
			E.on(_this.box, 'mousemove', function(e){
				var mouse = {x: e.clientX, y: e.clientY};
				S.each(_this.eles, function(n){
					var dis = D.offset(n);
					var disx = dis.left - mouse.x;
					var disy = dis.top - mouse.y;
					var offset = {x: disx * _this.delta, y: disy * _this.delta};
					D.css(n, {"left": n.start.x + offset.x, "top": n.start.y + offset.y});
				});
			});
		},
		init: function(){
			var _this = this;
			S.each(_this.eles, function(n){
				n.start = {x: parseInt(_this._getStyle(n, "left")), y: parseInt(_this._getStyle(n, "top"))};
			});
			_this._render();
		}
	};

	S.MoveEles = MoveEles;
});