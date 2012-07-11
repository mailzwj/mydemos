/**
 * Created with JetBrains WebStorm.
 * User: wb-zhengwujiang.z
 * Date: 12-7-9
 * Time: 下午3:43
 */

function getThisWeek(year,month,day){
    var today = new Date(year,month - 1,day);
    var week = today.getDay();
    if(week == 0){
        week = 7;
    }
    var monday = new Date(today.valueOf() - (week - 1) * 24 * 60 * 60 * 1000);
    var sunday = new Date(monday.valueOf() + 6 * 24 * 60 * 60 * 1000);
    var sY = monday.getFullYear(),
        sM = ((monday.getMonth() + 1).toString().length == 1 ? ("0" + (monday.getMonth() + 1)):(monday.getMonth() + 1)),
        sD = (monday.getDate().toString().length == 1 ? "0" + monday.getDate():monday.getDate());
    var eY = sunday.getFullYear(),
        eM = (sunday.getMonth() + 1 ).toString().length == 1 ? ("0" + (sunday.getMonth() + 1)):(sunday.getMonth() + 1),
        eD = sunday.getDate().toString().length == 1 ? "0" + sunday.getDate():sunday.getDate();
    return {"weekStart":sY + "/" + sM + "/" + sD,"weekEnd":eY + "/" + eM + "/" + eD};
}

function getPreviousWeek(year,month,day){
    var today = new Date(year,month - 1,day);
    var week = today.getDay();
    if(week == 0){
        week = 7;
    }
    var monday = new Date(today.valueOf() - (week + 6) * 24 * 60 * 60 * 1000);
    var sunday = new Date(monday.valueOf() + 6 * 24 * 60 * 60 * 1000);
    var sY = monday.getFullYear(),
        sM = ((monday.getMonth() + 1).toString().length == 1 ? ("0" + (monday.getMonth() + 1)):(monday.getMonth() + 1)),
        sD = (monday.getDate().toString().length == 1 ? "0" + monday.getDate():monday.getDate());
    var eY = sunday.getFullYear(),
        eM = (sunday.getMonth() + 1 ).toString().length == 1 ? ("0" + (sunday.getMonth() + 1)):(sunday.getMonth() + 1),
        eD = sunday.getDate().toString().length == 1 ? "0" + sunday.getDate():sunday.getDate();
    return {"weekStart":sY + "/" + sM + "/" + sD,"weekEnd":eY + "/" + eM + "/" + eD};
}

function getNextWeek(year,month,day){
    var today = new Date(year,month - 1,day);
    var week = today.getDay();
    if(week == 0){
        week = 7;
    }
    var monday = new Date(today.valueOf() - (week - 8) * 24 * 60 * 60 * 1000);
    var sunday = new Date(monday.valueOf() + 6 * 24 * 60 * 60 * 1000);
    var sY = monday.getFullYear(),
        sM = ((monday.getMonth() + 1).toString().length == 1 ? ("0" + (monday.getMonth() + 1)):(monday.getMonth() + 1)),
        sD = (monday.getDate().toString().length == 1 ? "0" + monday.getDate():monday.getDate());
    var eY = sunday.getFullYear(),
        eM = (sunday.getMonth() + 1 ).toString().length == 1 ? ("0" + (sunday.getMonth() + 1)):(sunday.getMonth() + 1),
        eD = sunday.getDate().toString().length == 1 ? "0" + sunday.getDate():sunday.getDate();
    return {"weekStart":sY + "/" + sM + "/" + sD,"weekEnd":eY + "/" + eM + "/" + eD};
}

function addToday(){
    var now = new Date();
    var wd = now.getDay();
    var nodes = $(".week-main:eq(0) .col");
    wd = wd == 0 ? 7 : wd;
    $(nodes[wd - 1]).addClass("today");
}

function removeToday(){
    var now = new Date();
    var wd = now.getDay();
    var nodes = $(".week-main:eq(0) .col");
    wd = wd == 0 ? 7 : wd;
    $(nodes[wd - 1]).removeClass("today");
}