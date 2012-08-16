/**
 * Created with MacVim.
 * User: wb-zhengwujiang.z
 * Date: 12-8-15
 * Time: 下午22:25
 */

KISSY.use("sizzle",function(S){
	var D = S.DOM, E = S.Event;
	var html = '';
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

	function addZero(num){
        double = num < 10 ? "0" + num : num;
        return double;
    }

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

	function setNowTimeLine(){
        var line = D.get("#nowTimeLine");
        var line_p = D.get(".week-main:eq(0)");
        var h_p = D.height(D.children(".time-line", line_p)[0]);
        var line_w = D.width(D.children(".col", line_p)[0]);
        var line_left = D.width(D.get(".week-main:eq(0) .time-line"));
        var timecount = 24 * 60 * 60 * 1000;
        var nowcount = new Date();
        var day = nowcount.getDay() == 0 ? 7 : nowcount.getDay();
        var daycount = new Date(nowcount.getFullYear() + "/" + addZero(nowcount.getMonth() + 1) + "/" + addZero(nowcount.getDate()));
        var percent = (nowcount.getTime() - daycount.getTime()) / timecount;
        var line_top = Math.floor(h_p * percent) - 1;
        day -= 1;
        line_left += day * D.outerWidth(D.children(".col", line_p)[0]);
        D.css(line, "display", "block");
        D.css(line, "left", line_left);
        D.css(line, "top", line_top);
        D.css(line, "width", line_w);
        setTimeout(function(){setNowTimeLine();}, 60000);
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
	
    D.css(D.get("#loading"), "display", "block");
    updateWeekHeader(g_hash.replace(/-/g, "/"));
    createWeekTable(g_hash.replace(/-/g, "/"), function(){
        //initLayer();
        if(includeToday(g_hash)){
            setNowTimeLine();
            addToday();
            D.attr(today, "disabled", true);
        }else{
            removeToday();
            D.attr(today, "disabled", false);
        }
    });
    //loadData(g_hash);

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
                    //initLayer();
                    if(includeToday(g_hash)){
                        setNowTimeLine();
                        addToday();
                        D.attr(today, "disabled", true);
                    }else{
                        removeToday();
                        D.attr(today, "disabled", false);
                    }
                });
                //loadData(g_hash);
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

    E.on(document, "click", function(e){
        var evt = D.get(e.target);
        var formhide = false;
        var updateflag = false;
        var ue = D.get(evt);
        while(ue.tagName != "BODY"){
            if(D.hasClass(ue, "fullalpha")){
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
