(function(){
	function CC(){};
	window.CC = CC;
	//创建默认配置，全局，可供外部修改
	CC.cfg = {
		codeBox: "pre.colorCode",
	};
	CC.regs = {
		html: {
			blank: /(^\s+)|(\s+$)/g,
			tag: /(\&lt;\/?)([a-zA-Z]+)/g,
			prop: /\s+([a-zA-Z]+)="(<|")/g,
			propval: /="(\S+)"/g,
			notestart: /\&lt;\!--/g,
			noteend: /--\&gt;/g
		},
		css: {
			style: /(^|\n)([a-zA-Z0-9-_\.#\s,]+)(?={)/g,
			tag: /(^|\n|\s+)([a-zA-Z]+)/g,
			clsorid: /([\.#][a-zA-Z0-9-_]+)/g,
			prop: /(^|\n|\s+|{|;)([a-zA-Z-]+)(?=\s?:)/g,
			propval: /(:\s?)([a-zA-Z0-9-_:\/#@\.]+)(;?)/g,
			notestart: /\/\*/g,
			noteend: /\*\//g
		},
		js: {
			keyword: /(new|do|break|while|typeof|delete|for|continue|if|with|try|switch|in|instanceof|case|default|throw|catch|finally|else|return)(?=;|\s|}|\(|{|:)/g,
			number: /(\d+|false|true|null)/g,
			notestart: /\/\*/g,
			noteend: /\*\//g
		}
	}
	CC.colorCode = function(){
		this.cs = CC.cfg;
		this._init();
	}
	CC.colorCode.prototype = {
		_hasClass: function(node, cls){
			var reg = new RegExp("(^|\\s+)" + cls + "(\\s+|$)", "g");
			if(reg.test(node.className)){
				reg.lastIndex = 0;
				return true;
			}
			return false;
		},
		_getNodes: function(){
			var _this = this, selector = _this.cs.codeBox.split("."), tagName = selector[0], tagClass = selector[1];
			var allTags = document.getElementsByTagName(tagName), len = allTags.length;
			var arr = [];
			if(len <= 0){return false;}
			for(var i = 0; i < len; i++){
				if(_this._hasClass(allTags[i], tagClass)){
					arr.push(allTags[i]);
				}
			}
			_this.cs = arr;
			if(arr.length > 0){
				return true;
			}else{
				return false;
			}
		},
		_formart: function(txt){
			var _this = this;
			var reg = /^(\s+)/g, str = '';
			if(reg.test(txt)){
				str = RegExp.$1;
				reg.lastIndex = 0;
				txt = txt.replace(CC.regs.html.blank, "").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(new RegExp("\\n(?:" + str + ")", "g"), "\n");
			}
			return txt;
		},
		_addHtmlColor: function(txt){
			var _this = this;
			txt = txt.replace(CC.regs.html.propval, function(){
				return '=\"<span class="html_propval">' + arguments[1] + '</span>\"';
			}).replace(CC.regs.html.prop, function(){
				return ' <span class="html_prop">' + arguments[1] + '</span>="' + arguments[2];
			}).replace(CC.regs.html.tag, function(){
				return arguments[1] + '<span class="html_tag">' + arguments[2] + '</span>';
			}).replace(CC.regs.html.notestart, function(){
				return '<span class="html_note">' + arguments[0];
			}).replace(CC.regs.html.noteend, function(){
				return arguments[0] + '</span>';
			});
			return txt;
		},
		_addCssColor: function(txt){
			var _this = this;
			txt = txt.replace(CC.regs.css.style, function(){
				var str = arguments[0];
				str = str.replace(CC.regs.css.tag, function(){
					return arguments[1] + '<span class="css_tag">' + arguments[2] +'</span>';
				}).replace(CC.regs.css.clsorid, function(){
					return '<span class="css_selector">' + arguments[1] +'</span>';
				});
				return str;
			}).replace(CC.regs.css.prop, function(){
				return arguments[1] + '<span class="css_prop">' + arguments[2] +'</span>';
			}).replace(CC.regs.css.propval, function(){
				return arguments[1] + '<span class="css_propval">' + arguments[2] +'</span>' + arguments[3];
			}).replace(CC.regs.css.notestart, function(){
				return '<span class="css_note">' + arguments[0];
			}).replace(CC.regs.css.noteend, function(){
				return arguments[0] + '</span>';
			});
			return txt;
		},
		_addJsColor: function(txt){
			var _this = this;
			txt = txt.replace(CC.regs.js.keyword, function(){
				return '<span class="js_internal">' + arguments[1] + '</span>';
			}).replace(CC.regs.js.number, function(){
				return '<span class="js_number">' + arguments[1] + '</span>';
			}).replace(CC.regs.js.notestart, function(){
				return '<span class="js_note">' + arguments[0];
			}).replace(CC.regs.js.noteend, function(){
				return arguments[0] + '</span>';
			});
			return txt;
		},
		_setCodeColor: function(){
			var _this = this, len = _this.cs.length, txt = '';
			for(var i = 0; i < len; i++){
				var format = _this.cs[i].getAttribute("format");
				txt = _this.cs[i].innerHTML;
				txt = _this._formart(txt);
				if(format && format.indexOf("html") != -1){
					txt = _this._addHtmlColor(txt);
				}
				if(format && format.indexOf("css") != -1){
					txt = _this._addCssColor(txt);
				}
				if(format && format.indexOf("js") != -1){
					txt = _this._addJsColor(txt);
				}
				_this.cs[i].innerHTML = txt;
			}
		},
		_init: function(){
			var _this = this;
			var nodes = _this._getNodes();
			if(nodes){
				_this._setCodeColor();
			}else{
				return false;
			}
		}
	};
})();