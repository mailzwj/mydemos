/**
 * Created with MacVim.
 * User: wb-zhengwujiang.z
 * Date: 12-8-15
 * Time: 下午22:25
 */

KISSY.use("sizzle",function(S){
	var D = S.DOM, E = S.Event;
	var html = '', rowHeight = 26;
	var global_nowtimeline = null;

	/* 函数名：createWeekTable
	 * 功能：在第一个class为week-main的元素中创建8列48行的周历表格
	 * 业务需求：8列48行，节点数太多，直接放置于DOM中比较混乱，由代码生成，方便管理，易于复用
	 * 参数说明：
	 *		fd：每周开始的一天，格式为yyyy/mm/dd
	 *		callback：表格创建完成后的回调函数，可用于表格内部的操作，或依赖该表格的操作
	 */
	function createWeekTable(fd, callback){
        var wm = D.get(".week-main"),
            col_span = '<div class="col-time time-line">',
            col_div_temp = '<div class="col col-{x}" date="{date}">',
            col_div = '',
            wk = 8,
            dis_day = 24 * 60 * 60 * 1000,
            firstDay = new Date(fd).getTime(),
            row = 24;
        for(var i = 0; i < wk; i++){
            if(i == 0){
                for(var j = 0; j < row; j++){
                    if(j >= 9 && j < 18) {
                        col_span += '<span class="time worktime">' + (j < 10 ? "0" + j : j) + ":00" + '</span><span class="time worktime odd"></span>';
                    }else{
                        col_span += '<span class="time">' + (j < 10 ? "0" + j : j) + ":00" + '</span><span class="time odd"></span>';
                    }
                }
                col_span += "</div>";
            }else{
                col_div += col_div_temp.replace("{x}", i - 1).replace("{date}", firstDay + dis_day * (i - 1));
                for(var j = 0; j < row; j++){
                    if(j >= 9 && j < 18) {
                        col_div += '<div class="time worktime"></div><div class="time worktime odd"></div>';
                    }else{
                        col_div += '<div class="time"></div><div class="time odd"></div>';
                    }
                }
                col_div += "</div>";
            }
        }

        D.html(wm, col_span + col_div + '<div id="nowTimeLine" class="nowtimeline"></div>');

        D.scrollTop(wm, 18 * (D.height(S.one(".week-main:eq(0) .time")) + 1));
        callback && callback();
    }

	/* 函数名：addZero
	 * 功能：为小于10的整数添加前置补零，保证两位数格式，例：0 -> 00
	 * 业务需求：脚本内部对日期时间操作较多，保证统一的两位格式，整体风格一致
	 * 参数说明：
	 *		num：有效正整数，小于10，自动补零返回，大于10，直接返回原数
	 */
	function addZero(num){
        double = num < 10 ? "0" + num : num;
        return double;
    }
	
	/* 函数名：updateWeekHeader
	 * 功能：修改表头每周中每天对应的日期
	 * 业务需求：由于系统具有上一周/下一周功能设计，可能频繁切换周日期，封装操作函数，方便频繁调用
	 * 参数说明：
	 *		fd：每周开始的一天，格式为yyyy/mm/dd
	 *		callback：表头更新完成后的回调函数，可用于表头内部的操作，或依赖该表表头的操作
	 */
	function updateWeekHeader(fd, callback){
        var wh = S.all(".week-day:eq(0)>li"),
            wk_box = D.get("#date-from-to"),
            firstDay = new Date(fd),
            wk = 7,
            dis_day = 24 * 60 * 60 * 1000,
            lastDay = new Date(firstDay.getTime() + (wk - 1) * dis_day),
            weekday = ["一","二","三","四","五","六","日"];
        for(var i = 0; i < wk; i++){
            var new_day = new Date(firstDay.getTime() + i * dis_day);
            D.html(wh[i], new_day.getDate() + " / " + (new_day.getMonth() + 1) + "（" + weekday[i] + "）");
        }

        D.html(wk_box, addZero(firstDay.getFullYear()) + "年" + addZero(firstDay.getMonth() + 1) + "月" + addZero(firstDay.getDate()) + "日"
            + " ~ " + addZero(lastDay.getFullYear()) + "年" + addZero(lastDay.getMonth() + 1) + "月" + addZero(lastDay.getDate()) + "日");

        callback && callback();
    }

	/* 函数名：includeToday
	 * 功能：判断当前所在周是否包含当天，返回布尔值
	 * 业务需求：在周切换操作中有对当前天做特殊操作，需要判断当天是否在当前显示周范围内
	 * 参数说明：
	 *		hs：当前URL中设置的hash值，实为每周开始的一天，格式为yyyy-mm-dd
	 */
	function includeToday(hs){
        var td = new Date(),
            tdstr = td.getFullYear() + "/" + (td.getMonth() + 1) + "/" + td.getDate(),
            flag = false;
        for(var t = 0; t < 7; t++){
            var nd = new Date(new Date(hs.replace(/-/g, "/")).valueOf() + t * 24 * 60 * 60 * 1000);
            if(nd.getFullYear() + "/" + (nd.getMonth() + 1) + "/" + nd.getDate() == tdstr){
                flag = true;
            }
        }
        return flag;
    }

	/* 函数名：setNowTimeLine
	 * 功能：在当前天所在的列设置当前时间线，标记当前具体时间位置
	 * 业务需求：为方便用户快速找到工作内容所处具体时段，更方便的记录日志，安排时间
	 */
	function setNowTimeLine(){
        var line = D.get("#nowTimeLine");
        var line_p = S.one(".week-main");
        var h_p = D.height(D.children(line_p, ".time-line")[0]);
        var line_w = D.width(D.children(line_p, ".col")[0]);
        var line_left = D.width(S.one(".week-main:eq(0) .time-line"));
        var timecount = 24 * 60 * 60 * 1000;
        var nowcount = new Date();
        var day = nowcount.getDay() == 0 ? 7 : nowcount.getDay();
        var daycount = new Date(nowcount.getFullYear() + "/" + addZero(nowcount.getMonth() + 1) + "/" + addZero(nowcount.getDate()));
        var percent = (nowcount.getTime() - daycount.getTime()) / timecount;
        var line_top = Math.floor(h_p * percent) - 1;
        day -= 1;
        line_left += day * D.outerWidth(D.children(line_p, ".col")[0]);
        D.css(line, "display", "block");
        D.css(line, "left", line_left);
        D.css(line, "top", line_top);
        D.css(line, "width", line_w);
        global_nowtimeline = setTimeout(function(){setNowTimeLine();}, 60000);
    }

	/* 函数名：getStartAndEnd
	 * 功能：返回日志的开始和结束时间，发送至后台用于存储记录，返回Object
	 * 业务需求：由于每一天中，用户可能存在多条日志记录，需分时段记录存储日志，故需要计算并存储每条日志对应的起始时间
	 * 参数说明：
	 *		srow：日志开始行，由于本应用中每行代表半小时，因此可根据该行号计算开始时间
	 *		h：该条日志对应节点的高度，由该值与每行代表的时间进行计算，可得与开始行的时间跨度，从而计算出结束时间
	 */
    function getStartAndEnd(srow, h){
        var val = {};
        var stime = srow * 0.5 * 60,
            erow = srow + Math.ceil(h / rowHeight),
            etime = erow * 0.5 * 60;
        val.d = erow - srow;
        val.startH = Math.floor(stime / 60);
        val.startH = val.startH < 10 ? '0' + val.startH : val.startH;
        val.startM = stime % 60;
        val.startM = val.startM < 10 ? '0' + val.startM : val.startM;
        val.endH = Math.floor(etime / 60);
        val.endH = val.endH < 10 ? '0' + val.endH : val.endH;
        val.endM = etime % 60;
        val.endM = val.endM < 10 ? '0' + val.endM : val.endM;
        val.start = [val.startH,val.startM].join(":");
        val.end = [val.endH,val.endM].join(":");
        return val;
    }

	/* 函数名：getIndexX
	 * 功能：计算拖动日志时的起始列索引，用于横向拖动，返回由周开始日期毫秒值和当前索引组成的Object
	 * 业务需求：日志需要实现横向拖动，实现跨天更改时间功能，需记录当前列的索引值，与每周一比较计算日志更改后的列日期
	 * 参数说明：
	 *		nd：当前选中（拖动）日志块所在列对应的日期，格式yyyy-mm-dd
	 */
	function getIndexX(nd){
		var cols = S.all(".week-main .col");
		var first_d = parseInt(D.attr(cols[0], "date"));
		var nd = new Date(nd.replace(/-/g, "/")).getTime();
		var one_d = 24 * 60 * 60 * 1000;
		var i_x = (nd - first_d) / one_d;
		return {s:first_d, c:i_x};
	}

	/* 函数名：changeFormAction
	 * 功能：完成用户对浮层表单的各项操作，保存（新增/修改），删除，关闭（取消）
	 * 业务需求：用户的任何一项修改或全新添加都需要保存记录
	 */
    function changeFormAction(){
        var form = S.one("#form-layer"),
			wm = S.one(".week-main"),
            fa = S.all(".week-main:eq(0) .fullalpha"),
			nodes = [],
			texts = [],
			resizes = [],
			log = null,
			log_resize = null,
			dragable = false,
			resize_able = false,
			drag_start = {x:0, y:0},
			drag_ing = {x:0, y:0},
			drag_end = {x:0, y:0},
			resize_start = {x:0, y:0},
			resize_ing = {x:0, y:0},
			resize_end = {x:0, y:0},
			index = 0,//起始行索引
			index_x = 0,//起始列索引
			week_s = 0,//每周开始的一天
			cd = 0;//当前操作日志日期
		S.each(fa, function(n){
			nodes.push(D.get("h5", n));
			texts.push(D.get(".log-text", n));
			resizes.push(D.get(".log-resize", n));
		});
		E.detach(nodes, "mousedown");
		E.detach(resizes, "mousedown");
		E.on(texts, "mouseup", function(e){e.halt();});
		E.on(texts, "click", function(){
			if(S.all(".week-main:eq(0) .text-empty").length > 0){
				D.remove(S.all(".week-main:eq(0) .text-empty"));
			}
			rePositionForm(D.parent(this, ".fullalpha"), "update");
			return false;
		});
        E.on(nodes, "mousedown", function(e){
            if(S.all(".week-main:eq(0) .text-empty").length > 0){
                D.remove(S.all(".week-main:eq(0) .text-empty"));
            }
			D.css("#form-layer", "display", "none");
			drag_start.x = e.clientX;
			drag_start.y = e.clientY;
			drag_ing.x = drag_start.x;
			drag_ing.y = drag_start.y;
			drag_end.x = drag_start.x;
			drag_end.y = drag_start.y;
			var s_time = D.attr(D.parent(this, ".fullalpha"), "date-start").split(" ")[1];//取得开始时间
			cd = D.attr(D.parent(this, ".fullalpha"), "date-start").split(" ")[0];
			var s_minutes = s_time.split(":")[0] * 60 + s_time.split(":")[1] * 1;
			index = s_minutes / 30;//每格30分钟，计算格子数，即起始index
			index_x = getIndexX(cd).c;
			week_s = getIndexX(cd).s;
			dragable = true;
			log = D.parent(this, ".fullalpha");
            //rePositionForm(this, "update");
			e.halt();
        });
		E.on(resizes, "mousedown", function(e){
            if(S.all(".week-main:eq(0) .text-empty").length > 0){
                D.remove(S.all(".week-main:eq(0) .text-empty"));
            }
			D.css("#form-layer", "display", "none");
			resize_start.x = e.clientX;
			resize_start.y = e.clientY;
			resize_ing.x = resize_start.x;
			resize_ing.y = resize_start.y;
			resize_end.x = resize_start.x;
			resize_end.y = resize_start.y;
			var s_time = D.attr(D.parent(this, ".fullalpha"), "date-start").split(" ")[1];//取得开始时间
			cd = D.attr(D.parent(this, ".fullalpha"), "date-start").split(" ")[0];
			var s_minutes = s_time.split(":")[0] * 60 + s_time.split(":")[1] * 1;
			index = s_minutes / 30;//每格30分钟，计算格子数，即起始index
			resize_able = true;
			log_resize = D.parent(this, ".fullalpha");
			e.halt();
        });
		E.on(wm, "mousemove", function(e){
			if(dragable){
				drag_end.x = e.clientX;
				drag_end.y = e.clientY;
				var dis = drag_end.y - drag_ing.y;
				var move_d = rowHeight;
				var dis_x = drag_end.x - drag_ing.x;
				var move_x = D.width(log) + 3;
				if(Math.abs(dis) > rowHeight / 2){
					move_d = dis > 0 ? rowHeight : -1 * rowHeight;
					D.css(log, "top", parseInt(D.css(log, "top")) + move_d);
					drag_ing.y += move_d;
					index = dis > 0 ? index + 1 : index - 1;
					var sToe = getStartAndEnd(index, D.height(log));
					var new_start = cd + " " + sToe.start + ":00";
					var new_end = cd + " " + sToe.end + ":00";
					D.html(D.get("h5", log), sToe.start + " ~ " + sToe.end);
					D.attr(log, "date-start", new_start);
					D.attr(log, "date-end", new_end);
				}
				if(Math.abs(dis_x) >= move_x){
					move_x = dis_x > 0 ? move_x : -1 * move_x;
					index_x = dis_x > 0 ? index_x + 1 : index_x - 1;
					if(index_x <= 0){
						index_x = 0;
					}else if(index_x >= 6){
						index_x = 6;
					}
					D.css(log, "left", parseInt(D.css(log, "left")) + move_x);
					drag_ing.x += move_x;
					var last_d = new Date(parseInt(week_s) + index_x * 24 * 60 * 60 * 1000);
					cd = last_d.getFullYear() + "-" + addZero(last_d.getMonth() + 1) + "-" + addZero(last_d.getDate());
					var sToend = getStartAndEnd(index, D.height(log));
					var new_start = cd + " " + sToend.start + ":00";
					var new_end = cd + " " + sToend.end + ":00";
					D.html(D.get("h5", log), sToend.start + " ~ " + sToend.end);
					D.attr(log, "date-start", new_start);
					D.attr(log, "date-end", new_end);
				}
			}
			if(resize_able){
				resize_end.x = e.clientX;
				resize_end.y = e.clientY;
				var log_d = resize_end.y - resize_ing.y;
				var log_move = rowHeight;
				if(Math.abs(log_d) > rowHeight){
					log_move = log_d > 0 ? rowHeight : -1 * rowHeight;
					resize_ing.y += log_move;
					D.css(log_resize, "height", D.height(log_resize) + log_move);
					var sToe = getStartAndEnd(index, D.height(log_resize));
					var new_start = cd + " " + sToe.start + ":00";
					var new_end = cd + " " + sToe.end + ":00";
					D.html(D.get("h5", log_resize), sToe.start + " ~ " + sToe.end);
					D.attr(log_resize, "date-start", new_start);
					D.attr(log_resize, "date-end", new_end);
				}
			}
		});
		E.on(document, "mouseup", function(e){
			var update_node = null;
			if(dragable){
				update_node = log;
			}
			if(resize_able){
				update_node = log_resize;
			}
			if(dragable || resize_able){
				dragable = false;
				resize_able = false;
				var url = 'worklogs/' + D.attr(update_node, 'id') + '.json';
				var cs = 'authenticity_token=' + D.attr(S.one('meta[name="csrf-token"]'), "content") + '&worklog[id]=' + D.attr(update_node, "id") + '&worklog[content]=' + D.html(D.get(".log-text", update_node)) + '&worklog[begin_at]=' + D.attr(update_node, "date-start") + '&worklog[end_at]=' + D.attr(update_node, "date-end") + '&worklog[team_name]=' + D.attr(update_node, "cat") + "&_method=put";
				S.IO({
					type: "POST",
					dataType: "json",
					url: url,
					data: cs,
					success: function(data){
					var json = data;
						if(json.status == "success"){
							changeFormAction();
						}else{
							alert("日志保存失败了，休息一会儿再来吧！");
						}
					}
				});
			}
		});
    }

	/* 函数名：rePositionForm
	 * 功能：根据用户操作，重新定位浮层表单
	 * 业务需求：由于每条日志在表格中的位置不一样，当用户新建或修改日志时，需要重新调整日志表单，以使指示更明确
	 * 参数说明：
	 *		dom：当前新增或修改的日志对应的节点
	 *		mth：标记行为（新增/修改），新增为add，修改为update，用于更改表单保存按钮的连接路径
	 */
    function rePositionForm(dom, mth){
        var f = S.one("#form-layer"),
            w = S.one(".week-main"),
            node = S.one(dom),
            dl = parseInt(D.css(node, "left")),
            dt = parseInt(D.css(node, "top")),
            dw = D.outerWidth(node),
            dh = D.outerHeight(node),
            fw = D.outerWidth(f),
            fh = D.outerHeight(f),
            fl = dl + dw + 20,
            ft = dt + (dh - fh) / 2 - D.scrollTop(w),
            cat = D.attr(node, "cat");
        D.removeClass(f, "outOfTheWindow");
        if (fl + fw > D.width(window)){
            fl -= (fw + dw + 40);
            D.addClass(f, "outOfTheWindow");
        }
        D.css(f, "left", fl);
        D.css(f, "top",ft);
        D.css(f, "display", "block");
        if(cat == "" || cat == "null"){cat = 0;}
        D.val(D.query("textarea", f)[0], D.html(D.children(node, ".log-text")[0]));
        D.query("textarea", f)[0].focus();
        D.val(D.query("input[type='hidden']", f)[0], D.attr(node, "id"));
        D.val(D.query("input[type='hidden']", f)[1], D.attr(node, "date-start"));
        D.val(D.query("input[type='hidden']", f)[2], D.attr(node, "date-end"));
        D.attr(S.all("#ecola-cat option[value='" + cat + "']"), "selected", true);
        D.attr(S.one(".ecola-del"), "href", "worklogs/" + D.attr(node, "id") + ".json");
        if(mth == "add"){
            D.attr(S.one(".ecola-save"), "href", "worklogs.json");//新增日志入口
            D.css(S.one(".ecola-del"), "visibility", "hidden");
        }else if(mth == "update"){
            D.attr(S.one(".ecola-save"), "href", "worklogs/" + D.attr(node, "id") + ".json");//修改日志入口
            D.css(S.one(".ecola-del"), "visibility", "visible");
        }

        E.detach(S.one(".ecola-save"), "click");
        E.detach(S.one(".ecola-del"), "click");
        E.on(S.one(".ecola-save"), "click", function(){
            var url = D.attr(this, "href");
            var param = {}, postData = {};
            param.content = D.val(S.one("textarea"));
            param.id = D.val(D.query("input[type='hidden']", f)[0]);
            param.begin_at = D.val(D.query("input[type='hidden']", f)[1]);
            param.end_at = D.val(D.query("input[type='hidden']", f)[2]);
            param.team_name = D.val(S.one("#ecola-cat"));
            postData.worklog = param;
            postData.authenticity_token = D.attr(S.one('meta[name="csrf-token"]'), "content");
            if(mth == "update"){
                postData._method = "put";
            }
			var cs = 'authenticity_token=' + postData.authenticity_token + '&worklog[id]=' + postData.worklog.id + '&worklog[content]=' + postData.worklog.content + '&worklog[begin_at]=' + postData.worklog.begin_at + '&worklog[end_at]=' + postData.worklog.end_at + '&worklog[team_name]=' + postData.worklog.team_name;
			if(mth == "update"){
				cs += '&_method=put';
			}
            S.IO({
                type: "POST",
				dataType: "json",
                url: url,
                data: cs,
                success: function(data){
                    var json = data;
                    if(json.status == "success"){
                        D.html(D.children(node, ".log-text")[0], param.content);
                        D.attr(node, "id", json.id);
                        D.attr(node, "cat", json.cat);
						D.attr(D.children(node, ".log-text")[0], "title", param.content);
                        D.removeClass(node, "text-empty");
                        D.addClass(node, "fullalpha");
                        D.css(S.one("#form-layer"), "display", "none");
                        html = '';
                        changeFormAction();
                    }else{
                        alert("日志保存失败了，休息一会儿再来吧！");
                    }
                }
            });
            return false;
        });

        E.on(S.one(".ecola-del"), "click", function(){
            var url = D.attr(this, "href");
            var flag = confirm("日志一经删除无法恢复，确定删除该条日志吗？");
            if(flag){
                S.IO.post(url, {"_method":"delete"}, function(data){
                    var json = data;
                    if(json.status == "success"){
                        D.css(S.one("#form-layer"), "display", "none");
                        //alert("日志删除成功");
                        D.remove(node);
                    }else{
                        alert("删除失败了，请稍后重试");
                    }
                });
            }

            return false;
        });
        //console.log(fw);
    }

	/* 函数名：initLayer
	 * 功能：初始化拖动选择日志块功能，在表格创建完成后，用户可在表格上按住鼠标拖动以选择日志时间段
	 * 业务需求：相比传统日志记录有更好的用户体验，更灵活的创建方式
	 */
    function initLayer(){
        var wm = S.one(".week-main");
        var weekdays = S.all(".week-main:eq(0)>.col");
        var fcol = S.one(".week-main:eq(0)>.col-time"), diff = {"x":1,"y":0};
        var clicked = false;
        var index_clicked = '';
        var index = '';
        var text = "";
        var m_start = {x: 0, y: 0};//鼠标点击位置
        var m_row = {x: 0, y: 0};//鼠标过渡位置
        var m_end = {x: 0, y: 0};//鼠标移动位置
        E.on(weekdays, "mousedown", function(e){
            index = S.indexOf(this, weekdays);
            m_start.x = e.clientX;
            m_start.y = e.clientY;
            m_row.x = e.clientX;
            m_row.y = e.clientY;
            var evt = e.target,
                hours = D.children(this, ".time"),
                index_par = S.indexOf(this, weekdays);//列索引
            clicked = true;
            index_clicked = S.indexOf(evt, hours);//起始行索引
            if(html != ''){
                D.remove(html);
                D.css(S.one("#form-layer"), "display", "none");
            }
            var width = D.outerWidth(evt),
                height = rowHeight,
                left = (index_par * width + D.width(fcol) + diff.x) + 'px',
                top = (index_clicked * height + diff.y ) + "px";
            html = D.create('<div class="uplayer text-empty"></div>');
            D.attr(html, "id", "");
            D.attr(html, "cat", "");
            D.css(html, "left", left);
            D.css(html, "top", top);
            D.css(html, "width", width - diff.x - 2);
            D.css(html, "height", 0);
            D.append(html, wm);
            return false;
        });
        E.on(wm, "mousemove", function(e){
            if(clicked){
                m_end.x = e.clientX;
                m_end.y = e.clientY;
                if(m_end.y - m_row.y >= rowHeight / 2){
                    m_row.y += rowHeight;
                    var h_height = D.height(html);
                    h_height = h_height > 0 ? h_height : -2;
                    D.css(html, "height", h_height + rowHeight);
                }else if(m_end.y - m_row.y <= -(rowHeight / 2)){
                    m_row.y -= rowHeight;
                    var h_height = D.height(html);
                    if(m_row.y <= m_start.y){
                        m_row.y = m_start.y;
                        D.css(html, "height", 0);
                    }else{
                        D.css(html, "height", h_height - rowHeight);
                    }
                }
                var hH = D.height(html) + 2;
                if(hH > 2){
                    var s2e = getStartAndEnd(index_clicked, hH);
                    var date = new Date(parseInt(D.attr(weekdays[index], "date")));
                    var datestart = date.getFullYear() + "-" + addZero(date.getMonth() + 1) + "-" + addZero(date.getDate()) + " " + s2e.start + ":00";
                    var dateend = date.getFullYear() + "-" + addZero(date.getMonth() + 1) + "-" + addZero(date.getDate()) + " " + s2e.end + ":00";
                    D.attr(html, "date-start", datestart);
                    D.attr(html, "date-end", dateend);
                    D.html(html, "<h5>" + [s2e.start,s2e.end].join(" ~ ") + "</h5><a href='#' class='log-text' title='" + text + "'>" + text + "</a><span class='log-resize'></span>");
                }
            }
        });
        E.on(document, "mouseup", function(){
			if(D.get(html) && D.height(html) <= 0){
				D.css(html, "height", 2 * rowHeight - 2);
				var s2e = getStartAndEnd(index_clicked, D.height(html));
                var date = new Date(parseInt(D.attr(weekdays[index], "date")));
                var datestart = date.getFullYear() + "-" + addZero(date.getMonth() + 1) + "-" + addZero(date.getDate()) + " " + s2e.start + ":00";
                var dateend = date.getFullYear() + "-" + addZero(date.getMonth() + 1) + "-" + addZero(date.getDate()) + " " + s2e.end + ":00";
                D.attr(html, "date-start", datestart);
                D.attr(html, "date-end", dateend);
                D.html(html, "<h5>" + [s2e.start,s2e.end].join(" ~ ") + "</h5><a href='#' class='log-text' title='" + text + "'>" + text + "</a><span class='log-resize'></span>");
			}
            if(clicked){
                rePositionForm(html, "add");
            }
            clicked = false;
            return false;
        });
    }

	/* 函数名：pushDataToCol
	 * 功能：页面加载完成后将从后台异步取回的数据添加到日历中
	 * 业务需求：日志在日历中的位置需要根据记录时间计算，因此需要JS动态计算每条日志的具体位置
	 * 参数说明：
	 *		index：该条日志所在列索引值，理论值0-6
	 *		val：该条日志内容组成的Object
	 *		size：每个单元格的尺寸用于计算left、top以及width、height
	 *		callback：数据显示完成后的回调函数
	 */
    function pushDataToCol(index, val, size, callback){
        var main = S.one(".week-main");
        var tc = S.one(".week-main:eq(0)>.col-time");
        var fc = D.create('<div class="uplayer fullalpha"></div>');
        var diff = {"x":1,"y":0};
        var m30 = 30 * 60 * 1000;
        var pl = D.width(tc) + index * parseInt(size.w) + diff.x;
        var pt = 0;
        var st = 0, et = 0, h = 0;
        var as = val.start.split(":");
        var ae = val.end.split(":");
        st = (as[0] * 60 * 60 + as[1] * 60) * 1000;
        et = (ae[0] * 60 * 60 + ae[1] * 60) * 1000;
        h = Math.abs(et / m30 - st / m30) * size.h;
        pt = (st / m30) * size.h;
        var node = D.clone(fc);
        D.attr(node,"id", val.id)
        D.attr(node, "cat", (val.cat && val.cat != null) ? val.cat : 0)
        D.attr(node, "date-start", val.date.replace(/\//g, "-") + " " + val.start + ":00")
        D.attr(node, "date-end", val.date.replace(/\//g, "-") + " " + val.end + ":00")
        D.css(node, "left", pl)
        D.css(node, "top", pt)
        D.css(node, "width", size.w - diff.x - 2)
        D.css(node, "height", h - 2)
        D.html(node, "<h5>" + val.start + " ~ " + val.end + "</h5><a href='#' class='log-text' title='" + val.content + "'>" + val.content + "</a><span class='log-resize'></span>");
        D.append(node, main);

        callback && callback();
    }

	/* 函数名：loadData
	 * 功能：加载日志数据
	 * 业务需求：所有日志数据均采用异步的方式从后台获取
	 * 参数说明：
	 *		s：每周开始的一天，格式为yyyy-mm-dd
	 */
    function loadData(s){   //周startDate
        var weekdays = S.all(".week-main:eq(0)>.col");
        S.getScript("worklogs.json?s=" + new Date(s.replace(/-/g, "/")).getTime(), function(){
			if(json.length > 0){
				S.each(json, function(val){
					S.each(weekdays, function(node){
						var j = S.indexOf(node, weekdays);
						if(D.attr(node, "date") == new Date(val.date).getTime()){
							var size = {"w":D.width(node), "h": rowHeight};
							pushDataToCol(j, val, size, function(){
								D.css(S.one("#loading"), "display", "none");
								changeFormAction();
							});  //将数据添加入对应列表
						}
					});
				});
			}else{
				D.css("#loading", "display", "none");
			}
        });
    }

	var nd = new Date();
    var tw = getThisWeek(nd.getFullYear(), nd.getMonth() + 1, nd.getDate());
    var cws = tw.weekStart;
    var g_hash = cws.replace(/\//g, "-"); //全局变量，存储当前hash值
    var currentHash = null;
    var reg = /(\d{4}-\d{2}-\d{2})/g;
    var prev = D.get("#week-prev"), next = D.get("#week-next"), today = D.get("#today");
    if(reg.test(window.location.href)){
        g_hash = RegExp.$1;
        RegExp.lastIndex = 0;
		D.css(D.get("#loading"), "display", "block");
		updateWeekHeader(g_hash.replace(/-/g, "/"));
		createWeekTable(g_hash.replace(/-/g, "/"), function(){
			initLayer();
			if(includeToday(g_hash)){
				setNowTimeLine();
				addToday();
				D.attr(today, "disabled", true);
			}else{
				clearTimeout(global_nowtimeline);
				removeToday();
				D.attr(today, "disabled", false);
			}
			loadData(g_hash);
		});
    }else{
        window.location.hash = "#" + g_hash;
    }

    S.all(".week-main").on("selectstart",function(){return false;});

    /*设置初始周列表窗口高度*/
    var wh = D.height(window);
    D.css(D.get(".week-main"), "height", wh - 220);  // 220 = 60(body的padding-top) + 58(cal-header) + 26(week-day) + 59(ecola-foot) + x(预留)

    E.on(window, "resize", function(){
        wh = D.height(window);
        D.css(D.get(".week-main"), "height", wh - 220);
    });
    
	S.all(window).on("hashchange", function(){
        var hs = window.location.href;
        var hash = hs.match(reg);
		//console.log(hash)
        if(hash && hash.length > 0){
            g_hash = hash[0];
            if(g_hash != currentHash){
                D.css(D.get("#loading"), "display", "block");
                updateWeekHeader(g_hash.replace(/-/g, "/"));
                createWeekTable(g_hash.replace(/-/g, "/"), function(){
                    initLayer();
                    if(includeToday(g_hash)){
                        setNowTimeLine();
                        addToday();
                        D.attr(today, "disabled", true);
                    }else{
						clearTimeout(global_nowtimeline);
                        removeToday();
                        D.attr(today, "disabled", false);
                    }
					loadData(g_hash);
                });
            }
        }else{
            g_hash = cws.replace(/\//g, "-");
            window.location.hash = "#" + g_hash;
        }
        currentHash = hash[0];
    });

    S.one("#form-layer .ecola-cancel").on("click", function(){
        var form = D.get("#form-layer");
        if(html != ''){
            D.remove(html);
        }
        D.css(form, "display", "none");
        return false;
    });

    E.on(document, "click, mouseup", function(e){
        var evt = D.get(e.target);
        var formhide = false;
        var updateflag = false;
        var ue = D.get(evt);
        while(ue.tagName != "BODY"){
            if(D.hasClass(ue, "fullalpha") || D.hasClass(ue, "text-empty") || D.hasClass(ue, "week-main")){
                updateflag = true;
                break;
            }
            ue = D.parent(ue);
        }
        while(evt.tagName != "BODY" && !updateflag){
            if(evt.id == "form-layer"){
                formhide = true;
                break;
            }
            evt = D.parent(evt);
        }
        if(!formhide && !updateflag){
            E.fire(S.one("#form-layer .ecola-cancel"), "click");
        }
    });

    E.on(today, "click", function(){
        g_hash = cws.replace(/\//g, "-");
        window.location.hash = "#" + g_hash;
    });

    E.on(prev, "click", function(){
        var pf = new Date(new Date(g_hash.replace(/-/g, "/")).getTime() - 7 * 24 * 60 * 60 * 1000);
        g_hash = pf.getFullYear() + "-" + addZero(pf.getMonth() + 1) + "-" + addZero(pf.getDate())
        window.location.hash = "#" + g_hash;
    });

    E.on(next, "click", function(){
        var nf = new Date(new Date(g_hash.replace(/-/g, "/")).getTime() + 7 * 24 * 60 * 60 * 1000);
        g_hash = nf.getFullYear() + "-" + addZero(nf.getMonth() + 1) + "-" + addZero(nf.getDate());
        window.location.hash = "#" + g_hash;
    });
});
