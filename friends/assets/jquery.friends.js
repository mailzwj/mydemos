jQuery.Friends = {
	getFrame: function(frameurl, cfg){
		jQuery.get(frameurl, function(data){
			jQuery(window).data("rb", data);
			var node = jQuery.Friends.writeFrame(cfg);
			jQuery.Friends.resize(node);
			jQuery.getJSON(cfg.dataurl + "?callback=?", function(json){
				var tpl = jQuery(cfg.listTpl).html().replace(/{{url}}/g, cfg.userinfourl);
				var con = jQuery(cfg.listContainer);
				if(json.success){
					var list = json.data, len = list.length;
					var nodes = [];
					for(var i = 0; i < len; i++){
						var str = tpl;
						str = jQuery.Friends.checkStatus(str, list[i].status);
						nodes.push(jQuery.Friends.replaceData(str, list[i]));
					}
					con.html(nodes.join(""));
					node.data("bd").jScrollPane();
				}
			});
		});
	},
	writeFrame: function(o){
		var dom = jQuery('<div class="F-RightBar"></div>');
		dom.html(jQuery(window).data("rb"))
			.css("display", "block")
			.css("height", jQuery(window).height() - o.offset.t - 2)
			.css("top", o.offset.t)
			.css("right", o.offset.r);
		jQuery("body").eq(0).append(dom);
		jQuery(dom).data("bd", jQuery(dom).find(o.bd).eq(0));
		jQuery(dom).data("hd", jQuery(dom).find(o.hd).eq(0));
		jQuery(dom).data("ft", jQuery(dom).find(o.ft).eq(0));
		jQuery(dom).data("bd").css("height", jQuery(dom).height() - jQuery(dom).data("hd").outerHeight() - jQuery(dom).data("ft").outerHeight() - 2);
		return dom;
	},
	resize: function(node){
		jQuery(window).bind("resize", function(){
			jQuery(node).css("height", jQuery(window).height() - parseInt(jQuery(node).css("top")) - 2);
			jQuery(node).data("bd").css("height", jQuery(node).height() - jQuery(node).data("hd").outerHeight() - jQuery(node).data("ft").outerHeight() - 2);
			node.data("bd").jScrollPane();
		});
	},
	checkStatus: function(str, s){
		var cls = " Rb-offline";
		switch(s){
			case 1: cls = " Rb-online";break;
			default: cls = " Rb-offline";
		}
		str = str.replace(/{{status}}/g, cls);
		return str;
	},
	replaceData: function(str, obj){
		var html = str;
		for(var j in obj){
			html = html.replace(new RegExp("{{" + j + "}}", "g"), obj[j]);
		}
		return html;
	}
}