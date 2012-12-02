KISSY.add('ged', function(S){
	var D = S.DOM, E = S.Event;
	function GED(cfg){
		this.eles = S.all(cfg.eles);
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
			E.on(node, 'mouseover', function(e){
				var dir = _this._getDir(e, data);
				switch(dir){
					case "l": D.html(node, "左方进入");break;
					case "t": D.html(node, "上方进入");break;
					case "r": D.html(node, "右方进入");break;
					case "b": D.html(node, "下方进入");break;
					default:
				}
			});
			E.on(node, 'mouseout', function(e){
				var dir = _this._getDir(e, data);
				switch(dir){
					case "l": D.html(node, "左方移出");break;
					case "t": D.html(node, "上方移出");break;
					case "r": D.html(node, "右方移出");break;
					case "b": D.html(node, "下方移出");break;
					default:
				}
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
