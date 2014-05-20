KISSY.add("jigsaw", function(S){
	var D = S.DOM, E = S.Event;

	function Jigsaw(cfg){
		this.box = S.one(cfg.box);
		this.shatter = D.query(cfg.shatter, this.box);
		this.lattice = D.query(cfg.lattice, this.box);
		this.offset = cfg.offset || {l: 0, t: 0};
		this.ss = cfg.shatterSize || {w: 100, h: 125};
		this.callback = cfg.callback || function(){};
		this.init();
	}

	Jigsaw.prototype = {
		_setShatter: function(){
			var _this = this, area = {l: 0, t: 0, w: 0, h: 0};
			area.l = _this.offset.l;
			area.t = _this.offset.t;
			area.w = D.width(_this.box) - area.l - _this.ss.w;
			area.h = D.height(_this.box) - area.t - _this.ss.h;

			S.each(_this.shatter, function(n, i){
				n.index = i;
				n.tar = _this.lattice[i];
				n.success = false;
				n.left = Math.floor(Math.random() * area.w) + area.l;
				n.top = Math.floor(Math.random() * area.h) + area.t;
				D.css(n, {"left": n.left, "top": n.top, "z-index": 1});
			});
		},
		_checkSuccess: function(){
			var _this = this;
			for(var i = 0; i < _this.shatter.length; i++){
				if(!_this.shatter[i].success){
					return false;
				}
			}
			return true;
		},
		_bindEvent: function(){
			var _this = this;
			var flag = false, cur = null, initZ = 0;

			E.on(_this.shatter, "mousedown", function(e){
				flag = true;
				initZ = D.css(this, "z-index");
				this.mx = e.clientX;
				this.my = e.clientY;
				cur = this;
				D.css(cur, "z-index", 2);
			});
			E.on(_this.box, "mousemove", function(e){
				if(flag){
					var delta = {x: 0, y: 0};
					delta.x = e.clientX - cur.mx;
					delta.y = e.clientY - cur.my;
					var end = {x: cur.left + delta.x, y: cur.top + delta.y};
					if(end.x <= 0){
						end.x = 0;
					}else if(end.x > D.innerWidth(_this.box) - D.width(cur)){
						end.x = D.innerWidth(_this.box) - D.width(cur);
					}
					if(end.y <= 0){
						end.y = 0;
					}else if(end.y > D.innerHeight(_this.box) - D.height(cur)){
						end.y = D.innerHeight(_this.box) - D.height(cur);
					}
					D.css(cur, {"left": end.x, "top": end.y});
				}
			});
			E.on(_this.shatter, "mouseup", function(e){
				if(flag){
					flag = false;
					this.left = parseInt(D.css(this, "left"));
					this.top = parseInt(D.css(this, "top"));
					cur = null;
					D.css(this, "z-index", initZ);

					var tar = D.offset(this.tar), ep = {x: this.left, y: this.top};
					if(Math.abs(D.offset(this).left - tar.left) < D.width(this) / 2 && Math.abs(D.offset(this).top - tar.top) < D.height(this) / 2){
						ep.x = tar.left - D.offset(_this.box).left;
						ep.y = tar.top - D.offset(_this.box).top;
						D.css(this, {"left": ep.x, "top": ep.y});
						this.left = ep.x;
						this.top = ep.y;
						E.detach(this, "mousedown");
						this.success = true;
						if(_this._checkSuccess()){
							_this.callback();
						}
					}
				}
			});
		},
		init: function(){
			var _this = this;
			_this._setShatter();
			_this._bindEvent();
		}
	};

	S.Jigsaw = Jigsaw;
});