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

    function initLayer(){
        var wm = $(".week-main").eq(0);
        var weekdays = $(".week-main:eq(0)>.col");
        var fcol = $(".week-main:eq(0)>.col-time").eq(0), diff = {"x":3,"y":0};
        var clicked = false;
        var index_clicked = '';
        var html = '';
        weekdays.each(function(i, eles){
            $(eles).bind("mousedown", function(e){
                var evt = e.target,
                    hours = $(this).children(".time"),
                    index_par = $.inArray(this, weekdays);
                clicked = true;
                index_clicked = $.inArray(evt, hours);
                var width = $(evt).width() + 1,
                    height = $(evt).height(),
                    left = (index_par * width + fcol.width() + diff.x) + 'px',
                    top = (index_clicked * (height + 1) + diff.y) + "px";
                html = $('<div></div>');
                html.css("position", "absolute")
                    .css("zIndex", 10)
                    .css("left", left)
                    .css("top", top)
                    .css("width", width - diff.x + "px")
                    .css("height", height + "px")
                    .css("opacity", 0.7)
                    .css("backgroundColor", "#ccc");
                wm.append(html);
            }).bind("mousemove", function(e){
                if(clicked){
                    var evt = e.target,
                        hours = $(this).children(".time"),
                        index_sub = $.inArray(evt, hours),
                        cha = index_sub - index_clicked;
                    var oh = html.height(),
                        nh = oh + Math.abs(cha) * ($(evt).height() + 1),
                        top = html.position().top;
                    index_clicked = index_sub;
                    if(cha < 0){
                        top -= $(evt).height() + 1;
                    }
                    html.css("top", top + "px")
                        .css("height", nh + "px");
                }
                $(document).bind("mouseup", function(){
                    clicked = false;
                })
            })
        });
    }

    var nd = new Date();
    var tw = getThisWeek(nd.getFullYear(), nd.getMonth() + 1, nd.getDate());
    var cws = tw.weekStart;
    updateWeekHeader(cws);
    createWeekTable(cws, initLayer);

    //console.log(getPreviousWeek(nd.getFullYear(), nd.getMonth() + 1, nd.getDate()));
});
