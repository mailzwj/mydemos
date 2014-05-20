KISSY.add('ged', function(S){
	var D = S.DOM, E = S.Event;
	function GED(cfg){
		this.eles = S.all(cfg.eles);
		this.ss = cfg.slider;
		this.init();
	}

	GED.prototype = {
		_getData: function(node){
			var pos = D.offset(node);
			var size = {};
			size.w = D.innerWidth(node);
			size.h = D.innerHeight(node);
			var point = {};
			point.lt = {x: pos.left, y: pos.top};
			point.rt = {x: pos.left + size.w, y: pos.top};
			point.lb = {x: pos.left, y: pos.top + size.h};
			point.rb = {x: pos.left + size.w, y: pos.top + size.h};
			var center = {x: pos.left + size.w / 2, y: pos.top + size.h / 2};
			var corner = {}, deg = 180 / Math.PI;
			corner.clt = Math.atan2(center.y - point.lt.y, point.lt.x - center.x) * deg;
			corner.crt = Math.atan2(center.y - point.rt.y, point.rt.x - center.x) * deg;
			corner.clb = Math.atan2(center.y - point.lb.y, point.lb.x - center.x) * deg;
			corner.crb = Math.atan2(center.y - point.rb.y, point.rb.x - center.x) * deg;

			return {pos: pos, size: size, point: point, center: center, corner: corner};
		},
		_getDir: function(e, data){
			var dir = "l";
			var enterPoint = {x: e.clientX + D.scrollLeft(window), y: e.clientY + D.scrollTop(window)};
			var cen = Math.atan2(data.center.y - enterPoint.y, enterPoint.x - data.center.x) * 180 / Math.PI;

			if(cen >= data.corner.crb && cen < data.corner.crt){
				dir = "r";
			}else if(cen >= data.corner.crt && cen < data.corner.clt){
				dir = "t";
			}else if(cen >= data.corner.clb && cen < data.corner.crb){
				dir = "b";
			}
			return dir;
		},
		_render: function(node){
			var _this = this;
			var data = _this._getData(node);
			var ss = D.get(_this.ss, node);
			E.on(node, 'mouseenter', function(e){
				var dir = _this._getDir(e, data);
				var left = -data.size.w, top = 0;
				switch(dir){
					case "l": 
						D.html(ss, "左方进入");
						break;
					case "t": 
						D.html(ss, "上方进入");
						left = 0;
						top = -data.size.h;
						break;
					case "r": 
						D.html(ss, "右方进入");
						left = data.size.w;
						top = 0;
						break;
					case "b": 
						D.html(ss, "下方进入");
						left = 0;
						top = data.size.h;
						break;
					default:
				}
				D.css(ss, {"left": left, "top": top});
				if(node.anim && node.anim.isRunning()){
					node.anim.stop();
				}
				node.anim = new S.Anim(ss, {"left": 0, "top": 0}, 0.2, "easeIn", function(){});
				node.anim.run();
			});
			E.on(node, 'mouseleave', function(e){
				var dir = _this._getDir(e, data);
				var left = -data.size.w, top = 0;
				switch(dir){
					case "l": 
						break;
					case "t": 
						left = 0;
						top = -data.size.h;
						break;
					case "r": 
						left = data.size.w;
						top = 0;
						break;
					case "b": 
						left = 0;
						top = data.size.h;
						break;
					default:
				}

				if(node.anim && node.anim.isRunning()){
					node.anim.stop();
				}
				node.anim = new S.Anim(ss, {"left": left, "top": top}, 0.2, "easeIn", function(){});
				node.anim.run();
			});
		},
		init: function(){
			var _this = this;
			S.each(_this.eles, function(n){
				_this._render(n);
			});
		}
	};

	S.GED = GED;
});
