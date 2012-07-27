/**
 * Created with JetBrains WebStorm.
 * User: wb-zhengwujiang.z
 * Date: 12-7-9
 * Time: 下午2:47
 */

$(function(){

    var html = '';//全局

    /*
     * fd: first day in this week
     * callback: a function witch initial at the end of this function
     */
    function createWeekTable(fd, callback){
        var wm = $(".week-main:eq(0)"),
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

        wm.html(col_span + col_div);

        wm.scrollTop(18 * ($(".week-main:eq(0) .time").eq(0).height() + 1));
        callback && callback();
    }

    function addZero(num){
        double = num < 10 ? "0" + num : num;
        return double;
    }

    function updateWeekHeader(fd, callback){
        var wh = $(".week-day:eq(0)>li"),
            wk_box = $("#date-from-to"),
            firstDay = new Date(fd),
            wk = 7,
            dis_day = 24 * 60 * 60 * 1000,
            lastDay = new Date(firstDay.getTime() + (wk - 1) * dis_day),
            weekday = ["一","二","三","四","五","六","日"];
        for(var i = 0; i < wk; i++){
            var new_day = new Date(firstDay.getTime() + i * dis_day);
            wh.eq(i).html(new_day.getDate() + " / " + (new_day.getMonth() + 1) + "（" + weekday[i] + "）");
        }

        wk_box.html(addZero(firstDay.getFullYear()) + "年" + addZero(firstDay.getMonth() + 1) + "月" + addZero(firstDay.getDate()) + "日"
            + " ~ " + addZero(lastDay.getFullYear()) + "年" + addZero(lastDay.getMonth() + 1) + "月" + addZero(lastDay.getDate()) + "日");

        callback && callback();
    }

    function getStartAndEnd(srow, erow){
        var val = {};
        var stime = srow * 0.5 * 60,
            etime = (erow + 1) * 0.5 * 60;
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

    function rePositionForm(dom, mth){
        var f = $("#form-layer"),
            w = $(".week-main:eq(0)"),
            d = $(dom),
            dl = parseInt(d.css("left")),
            dt = parseInt(d.css("top")),
            dw = d.outerWidth(),
            dh = d.outerHeight(),
            fw = f.outerWidth(),
            fh = f.outerHeight(),
            fl = dl + dw + 20,
            ft = dt + (dh - fh) / 2 - w.scrollTop(),
            cat = d.attr("cat");
        f.removeClass("outOfTheWindow");
        if (fl + fw > $(window).width()){
            fl -= (fw + dw + 40);
            f.addClass("outOfTheWindow");
        }
        f.css("left", fl + "px")
            .css("top",ft + "px")
            .css("display", "block");
        if(cat == "" || cat == "null"){cat = 0;}
        f.find("textarea").eq(0).val(d.children("div").eq(0).html()).focus();
        f.find("input[type='hidden']").eq(0).val(d.attr("id"));
        f.find("input[type='hidden']").eq(1).val(d.attr("date-start"));
        f.find("input[type='hidden']").eq(2).val(d.attr("date-end"));
        f.find("#ecola-cat option[value='" + cat + "']").attr("selected", true);
        f.find(".ecola-del").eq(0).attr("href","worklogs/" + d.attr("id") + ".json");
        if(mth == "add"){
            f.find(".ecola-save").eq(0).attr("href", "worklogs.json");//新增日志入口
            f.find(".ecola-del").eq(0).css("visibility", "hidden");
        }else if(mth == "update"){
            f.find(".ecola-save").eq(0).attr("href", "worklogs/" + d.attr("id") + ".json");//修改日志入口
            f.find(".ecola-del").eq(0).css("visibility", "visible");
        }

        f.find(".ecola-save").eq(0).unbind("click");
        f.find(".ecola-del").eq(0).unbind("click");
        f.find(".ecola-save").eq(0).bind("click", function(){
            var url = $(this).attr("href");
            var param = {}, postData = {};
            param.content = f.find("textarea").eq(0).val();
            param.id = f.find("input[type='hidden']").eq(0).val();
            param.begin_at = f.find("input[type='hidden']").eq(1).val();
            param.end_at = f.find("input[type='hidden']").eq(2).val();
            param.logtype_id = parseInt($("#ecola-cat").val());
			postData.worklog = param;
			postData.authenticity_token = $('meta[name="csrf-token"]').eq(0).attr('content');
            if(mth == "update"){
                postData._method = "put";
            }
            //console.log(param);
            //saveData(d, url, {"worklogs": param}, mth);//日志节点，后台接口地址，url参数，操作类型
            $.ajax({
                type: "POST",
                url: url,
                data: postData,
                /*beforeSend: function(xhr) {
                    xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
                },*/
                success: function(data){
                    var json = data;
                    if(json.status == "success"){
                        d.children("div").eq(0).html(param.content);
                        d.attr("id", json.id)
                         .attr("cat", json.cat)
                         .removeClass("text-empty")
                         .addClass("fullalpha")
                        $("#form-layer").css("display", "none");
                        html = '';
                        changeFormAction();
                    }else{
                        alert("日志保存失败了，休息一会儿再来吧！");
                    }
                }
            });
            return false;
        });

        f.find(".ecola-del").eq(0).bind("click", function(){
            var url = $(this).attr("href");
            var flag = confirm("日志一经删除无法恢复，确定删除该条日志吗？");
            if(flag){
                $.post(url, {"_method":"delete"}, function(data){
                    var json = data;
                    if(json.status == "success"){
                        $("#form-layer").css("display", "none");
                        //alert("日志删除成功");
                        d.remove();
                    }else{
                        alert("删除失败了，请稍后重试");
                    }
                });
            }

            return false;
        });
        //console.log(fw);
    }

    function initLayer(){
        var wm = $(".week-main").eq(0);
        var weekdays = $(".week-main:eq(0)>.col");
        var fcol = $(".week-main:eq(0)>.col-time").eq(0), diff = {"x":3,"y":0};
        var clicked = false;
        var index_clicked = '';
        var index = '';
        var text = "";
        weekdays.each(function(i, eles){
            $(eles).mousedown(function(e){
                var evt = e.target,
                    hours = $(this).children(".time"),
                    index_par = $.inArray(this, weekdays);
                index = i;
                clicked = true;
                index_clicked = $.inArray(evt, hours);
                if(html != ''){
                    $(html).remove();
                    $("#form-layer").css("display", "none");
                }
                var s2e = getStartAndEnd(index_clicked, index_clicked),
                    width = $(evt).width() + 1,
                    height = $(evt).height(),
                    left = (index_par * width + fcol.width() + diff.x) + 'px',
                    top = (index_clicked * (height + 1) + diff.y ) + "px";
                var date = new Date(parseInt($(evt).parent(".col").eq(0).attr("date")));
                var datestart = date.getFullYear() + "-" + addZero(date.getMonth() + 1) + "-" + addZero(date.getDate()) + " " + s2e.start + ":00";
                var dateend = date.getFullYear() + "-" + addZero(date.getMonth() + 1) + "-" + addZero(date.getDate()) + " " + s2e.end + ":00";
                html = $('<div class="uplayer text-empty"></div>');
                html.attr("id", "")
                    .attr("cat", "")
                    .attr("date-start", datestart)
                    .attr("date-end", dateend)
                    .css("left", left)
                    .css("top", top)
                    .css("width", width - diff.x + "px")
                    .css("height", height - 2 + "px")
                    .html("<h5>" + [s2e.start,s2e.end].join(" ~ ") + "</h5><div title='" + text + "'>" + text + "</div>");
                wm.append(html);
            }).mouseover(function(e){
                if(clicked && index == $.inArray(eles, weekdays)){
                    var evt = e.target,
                        hours = $(this).children(".time"),
                        index_sub = $.inArray(evt, hours),
                        cha = index_sub - index_clicked;
                    var oh = $(html).height(),
                        nh = oh,
                        et = index_sub,
                        top = parseInt(html.css("top"));
                    if(cha < 0){
                        top += cha * ($(evt).height() + 1);
                        nh = oh + 2 + Math.abs(cha) * ($(evt).height() + 1);
                        index_clicked = index_sub;
                        et = Math.ceil(nh / ($(evt).height() + 1)) + index_clicked - 1;
                    }else if(cha > 0){
                        nh = (cha + 1) * ($(evt).height() + 1);
                        et = index_sub;
                    }
                    var s2e = getStartAndEnd(index_clicked, et);
                    var date = new Date(parseInt($(evt).parent(".col").eq(0).attr("date")));
                    var datestart = date.getFullYear() + "-" + addZero(date.getMonth() + 1) + "-" + addZero(date.getDate()) + " " + s2e.start + ":00";
                    var dateend = date.getFullYear() + "-" + addZero(date.getMonth() + 1) + "-" + addZero(date.getDate()) + " " + s2e.end + ":00";
                    html.attr("date-start", datestart)
                        .attr("date-end", dateend)
                        .css("top", top + "px")
                        .css("height", nh - 2 + "px");
                    $(html).children("h5").eq(0).html([s2e.start,s2e.end].join(" ~ "))
                }
                return false;
            });
        });
        $(document).mouseup(function(){
            if(html != "" && clicked){
                rePositionForm(html, "add");
            }
            clicked = false;
        });
    }

    function pushDataToCol(index, val, size, callback){
        var main = $(".week-main:eq(0)");
        var tc = $(".week-main:eq(0)>.col-time").eq(0);
        var fc = $('<div class="uplayer fullalpha"></div>');
        var diff = {"x":3,"y":0};
        var m30 = 30 * 60 * 1000;
        var pl = tc.width() + index * parseInt(size.w) + diff.x;
        var pt = 0;
        var st = 0, et = 0, h = 0;
        var as = val.start.split(":");
        var ae = val.end.split(":");
        st = (as[0] * 60 * 60 + as[1] * 60) * 1000;
        et = (ae[0] * 60 * 60 + ae[1] * 60) * 1000;
        h = Math.abs(et / m30 - st / m30) * size.h;
        pt = (st / m30) * size.h;
        var node = fc.clone();
        $(node).attr("id", val.id)
            .attr("cat", (val.cat && val.cat != null) ? val.cat : 0)
            .attr("date-start", val.date.replace(/\//g, "-") + " " + val.start + ":00")
            .attr("date-end", val.date.replace(/\//g, "-") + " " + val.end + ":00")
            .css("left", pl + "px")
            .css("top", pt + "px")
            .css("width", (size.w - diff.x) + "px")
            .css("height", h - 2 + "px")
            .html("<h5>" + val.start + " ~ " + val.end + "</h5><div title='" + val.content + "'>" + val.content + "</div>");
        main.append($(node));

        callback && callback();
    }

    function changeFormAction(){
        var form = $("#form-layer"),
            nodes = $(".week-main:eq(0) .fullalpha");
        nodes.click(function(){
            if($(".week-main:eq(0) .text-empty").length > 0){
                $(".week-main:eq(0) .text-empty").remove();
            }
            rePositionForm(this, "update");
        });
    }

    function loadData(s){   //周startDate
        var weekdays = $(".week-main:eq(0)>.col");
        $.getScript("worklogs.json?s=" + new Date(s.replace(/-/g, "/")).getTime(), function(){
            $(json).each(function(i, val){
                weekdays.each(function(j, node){
                    if($(node).attr("date") == new Date(val.date).getTime()){
                        var size = {"w":$(node).width(), "h":($(node).children(".time:eq(0)").height() + 1)}
                        pushDataToCol(j, val, size, changeFormAction);  //将数据添加入对应列表
                    }
                });
            });
        });
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

    var nd = new Date();
    var tw = getThisWeek(nd.getFullYear(), nd.getMonth() + 1, nd.getDate());
    var cws = tw.weekStart;
    var g_hash = cws.replace(/\//g, "-"); //全局变量，存储当前hash值
    var currentHash = null;
    var reg = /(\d{4}-\d{2}-\d{2})/g;
    var prev = $("#week-prev"), next = $("#week-next"), today = $("#today");
    if(reg.test(window.location.href)){
        g_hash = RegExp.$1;
        RegExp.lastIndex = 0;
    }else{
        window.location.hash = "#" + g_hash;
    }

    $(".week-main").bind("selectstart",function(){return false;});

    /*设置初始周列表窗口高度*/
    var wh = $(window).height();
    $(".week-main").eq(0).css("height", wh - 220);  // 185 = 60(body的padding-top) + 58(cal-header) + 26(week-day) + 59(ecola-foot) + x(预留)

    $(window).resize(function(){
        wh = $(window).height();
        $(".week-main").eq(0).css("height", wh - 220);
    });

    $(window).hashchange(function(){
        var hs = window.location.href;
        var hash = hs.match(reg);
        if(hash && hash.length > 0){
            g_hash = hash[0];
            if(g_hash != currentHash){
                updateWeekHeader(g_hash.replace(/-/g, "/"));
                createWeekTable(g_hash.replace(/-/g, "/"), function(){
                    initLayer();
                    if(includeToday(g_hash)){
                        addToday();
                        today.attr("disabled", true);
                    }else{
                        removeToday();
                        today.attr("disabled", false);
                    }
                });
                loadData(g_hash);
            }
        }else{
            g_hash = cws.replace(/\//g, "-");
            window.location.hash = "#" + g_hash;
        }
        currentHash = hash[0];
    });

    $("#form-layer .ecola-cancel").eq(0).click(function(){
        var form = $("#form-layer");
        if(html != ''){
            $(html).remove();
        }
        form.css("display", "none");
        return false;
    });

    $(document).click(function(e){
        var evt = $(e.target);
        var formhide = false;
        var updateflag = false;
        var ue = $(evt);
        while(ue.get(0).tagName != "BODY"){
            if(ue.hasClass("fullalpha")){
                updateflag = true;
                break;
            }
            ue = $(ue).parent();
        }
        while(evt.get(0).tagName != "BODY" && !updateflag){
            if(evt.get(0).id == "form-layer"){
                formhide = true;
                break;
            }
            evt = $(evt).parent();
        }
        if(!formhide && !updateflag){
            $("#form-layer .ecola-cancel").eq(0).trigger("click");
        }
    });

    today.click(function(){
        g_hash = cws.replace(/\//g, "-");
        window.location.hash = "#" + g_hash;
    });

    prev.click(function(){
        var pf = new Date(new Date(g_hash.replace(/-/g, "/")).getTime() - 7 * 24 * 60 * 60 * 1000);
        g_hash = pf.getFullYear() + "-" + addZero(pf.getMonth() + 1) + "-" + addZero(pf.getDate())
        window.location.hash = "#" + g_hash;
    });

    next.click(function(){
        var nf = new Date(new Date(g_hash.replace(/-/g, "/")).getTime() + 7 * 24 * 60 * 60 * 1000);
        g_hash = nf.getFullYear() + "-" + addZero(nf.getMonth() + 1) + "-" + addZero(nf.getDate());
        window.location.hash = "#" + g_hash;
    });
});
