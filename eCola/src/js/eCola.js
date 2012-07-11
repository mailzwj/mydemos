/**
 * Created with JetBrains WebStorm.
 * User: wb-zhengwujiang.z
 * Date: 12-7-9
 * Time: 下午2:47
 */

$(function(){
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
                    col_span += '<span class="time">' + ((j > 12) ? (j - 12) : j) + '&nbsp;<b>' + (j < 12 ? 'am' : 'pm') + '</b></span><span class="time odd"></span>';
                }
                col_span += "</div>";
            }else{
                col_div += col_div_temp.replace("{x}", i - 1).replace("{date}", firstDay + dis_day * (i - 1));
                for(var j = 0; j < row; j++){
                    col_div += '<div class="time"></div><div class="time odd"></div>';
                }
                col_div += "</div>";
            }
        }

        wm.html(col_span + col_div);

        wm.scrollTop(18 * ($(".week-main:eq(0) .time").eq(0).height() + 1));
        callback && callback();
    }

    function updateWeekHeader(fd, callback){
        var wh = $(".week-day:eq(0)>li"),
            firstDay = new Date(fd).getTime(),
            wk = 7,
            dis_day = 24 * 60 * 60 * 1000,
            weekday = ["一","二","三","四","五","六","日"];
        for(var i = 0; i < wk; i++){
            var new_day = new Date(firstDay + i * dis_day);
            wh.eq(i).html(new_day.getDate() + " / " + (new_day.getMonth() + 1) + "（" + weekday[i] + "）");
        }

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

    function rePositionForm(dom){
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
            ft = dt + (dh - fh) / 2 - w.scrollTop();
        f.css("left", fl + "px")
            .css("top",ft + "px")
            .css("display", "block");
        f.find("textarea").eq(0).focus();//由此继续
        //console.log(fw);
    }

    function initLayer(){
        var wm = $(".week-main").eq(0);
        var weekdays = $(".week-main:eq(0)>.col");
        var fcol = $(".week-main:eq(0)>.col-time").eq(0), diff = {"x":3,"y":0};
        var clicked = false;
        var index_clicked = '';
        var html = '';
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
                html = $('<div class="uplayer text-overflow"></div>');
                html.attr("id", "")
                    .attr("cat", "")
                    .css("left", left)
                    .css("top", top)
                    .css("width", width - diff.x + "px")
                    .css("height", height + "px")
                    .html("<h5>" + [s2e.start,s2e.end].join(" ~ ") + "</h5><div title='" + text + "'>" + text + "</div>");
                wm.append(html);
            }).mousemove(function(e){
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
                        nh = oh + Math.abs(cha) * ($(evt).height() + 1);
                        index_clicked = index_sub;
                        et = Math.floor(oh / ($(evt).height() + 1)) + index_clicked + 1;
                    }else if(cha > 0){
                        nh = (cha + 1) * ($(evt).height() + 1);
                        et = index_sub;
                    }
                    var s2e = getStartAndEnd(index_clicked, et);
                    html.css("top", top + "px")
                        .css("height", nh + "px");
                    $(html).children("h5").eq(0).html([s2e.start,s2e.end].join(" ~ "))
                }
                return false;
            });
        });
        $(document).mouseup(function(){
            if(html != "" && clicked){
                rePositionForm(html);
            }
            clicked = false;
        });
    }

    function pushDataToCol(index, arr, size){
        //console.log(index);
        var main = $(".week-main:eq(0)");
        var tc = $(".week-main:eq(0)>.col-time").eq(0);
        var fc = $('<div class="uplayer fullalpha"></div>');
        var diff = {"x":3,"y":0};
        var m30 = 30 * 60 * 1000;
        var pl = tc.width() + index * parseInt(size.w) + diff.x;
        var pt = 0;
        var st = 0, et = 0, h = 0;
        $(arr).each(function(num, obj){
            var as = obj.start.split(":");
            var ae = obj.end.split(":");
            st = (as[0] * 60 * 60 + as[1] * 60) * 1000;
            et = (ae[0] * 60 * 60 + ae[1] * 60) * 1000;
            h = Math.abs(et / m30 - st / m30) * size.h;
            pt = (st / m30) * size.h;
            var node = fc.clone();
            $(node).attr("id", obj.id)
                .attr("cat", obj.cat)
                .css("left", pl + "px")
                .css("top", pt + "px")
                .css("width", (size.w - diff.x) + "px")
                .css("height", h + "px")
                .html("<h5>" + obj.start + " ~ " + obj.end + "</h5><div title='" + obj.content + "'>" + obj.content + "</div>");
            main.append($(node));
        });
    }

    function loadData(s){   //周startDate
        var weekdays = $(".week-main:eq(0)>.col");
        $.getScript("ajax/data.json", function(){
            //console.log(json);
            $(json).each(function(i, val){
                weekdays.each(function(j, node){
                    if($(node).attr("date") == new Date(val.date).getTime()){
                        var size = {"w":$(node).width(), "h":($(node).children(".time:eq(0)").height() + 1)}
                        pushDataToCol(j, val.log, size);  //将数据添加入对应列表
                    }
                });
            });
        });
    }

    var nd = new Date();
    var tw = getThisWeek(nd.getFullYear(), nd.getMonth() + 1, nd.getDate());
    var cws = tw.weekStart;
    var g_hash = cws.replace(/\//g, "-"); //全局变量，存储当前hash值
    var reg = /#(\d{4}-\d{2}-\d{2})/g
    if(reg.test(window.location.href)){
        g_hash = RegExp.$1;
        RegExp.lastIndex = 0;
    }else{
        window.location.hash = "#" + g_hash;
    }
    $(".week-main").bind("selectstart",function(){return false;});
    updateWeekHeader(g_hash.replace(/-/g, "/"));
    createWeekTable(g_hash.replace(/-/g, "/"), initLayer);
    loadData(g_hash.replace(/-/g, "/"));

    //console.log(getPreviousWeek(nd.getFullYear(), nd.getMonth() + 1, nd.getDate()));
});
