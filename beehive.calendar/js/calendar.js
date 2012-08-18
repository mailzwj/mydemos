function cal_config(op){
	document.writeln('<div id="main"><div id="tool"></div><div id="calendar"></div><div id="append" ></div></div>');
	try{
		var cr=new Calendar();
			cr.date=op.date;
			cr.mode=op.mode;
			cr.language=new Language(op.language);

			cr.load();
			cr.tool();
	}catch(e){
		alert('抱歉，出现异常：'+e);	
	}
}

//日历对象
var Calendar=function(){
	this.date;
	this.language;
	
	this.toolBar=_('tool');
	this.content=_('calendar');
	this.content.innerHTML='';
	this.mode;
}
//加载日历
Calendar.prototype.load=function(){
	this.header();
	this.list();
	this.status();
}
//日历工具栏面板
Calendar.prototype.tool=function(){
	this.c_tl_tb=_create('table');	
	this.c_tl_tbody=_create('tbody');
	this.c_tl_tb_tr=_create('tr');
	this.c_tl_tb_td_1=_create('td');
	this.c_tl_tb_td_2=_create('td');
	this.year_a=_create('a');
	this.month_a=_create('a');
	this.week_a=_create('a');
	this.day_a=_create('a');
	this.prevMonth_div=_create('div');
	this.nextMonth_div=_create('div');
	this.prevMonth_div.className='prevMonth';
	this.nextMonth_div.className='nextMonth';
	
	this.language_input=_create('input');
	this.language_input.type='hidden';
	this.language_input.id='hidden_language';
	this.language_input.value=this.language.type;
	
	this.tab_input=_create('input');
	this.tab_input.type='hidden';
	this.tab_input.id='tab_input';
	this.tab_input.value=this.mode;
	
	this.c_tl_tb.className='Calendar';
	this.c_tl_tb_tr.className='CalendarOtherMonthDay';
	this.c_tl_tb_td_1.width='200';
	this.c_tl_tb_td_1.style.padding='3px';
	this.c_tl_tb_td_1.style.textAlign='left';
	this.c_tl_tb_td_2.style.padding='3px';
	this.c_tl_tb_td_2.style.textAlign='left';
	
	addEvents(this.prevMonth_div,'click',Prev);
	addEvents(this.nextMonth_div,'click',Next);
	if(this.mode=='year'){
		this.year_a.className='selectTab';
	}else if(this.mode=='month'){
		this.month_a.className='selectTab';
	}else if(this.mode=='week'){
		this.week_a.className='selectTab';
	}else if(this.mode=='day'){
		this.day_a.className='selectTab';
	}
	
	this.year_a.innerHTML=this.language.year;
	this.month_a.innerHTML=this.language.month;
	this.week_a.innerHTML=this.language.week;
	this.day_a.innerHTML=this.language.day;
	
	this.year_a.href='year.html';
	this.month_a.href='month.html';
	this.week_a.href='week.html';
	this.day_a.href='day.html';
	
	this.c_tl_tb_td_1.appendChild(this.year_a);
	this.c_tl_tb_td_1.appendChild(this.month_a);
	this.c_tl_tb_td_1.appendChild(this.week_a);
	this.c_tl_tb_td_1.appendChild(this.day_a);
	this.c_tl_tb_td_2.appendChild(this.prevMonth_div);
	this.c_tl_tb_td_2.appendChild(this.nextMonth_div);
	this.c_tl_tb_td_2.appendChild(this.language_input);
	this.c_tl_tb_td_2.appendChild(this.tab_input);
	this.c_tl_tb_tr.appendChild(this.c_tl_tb_td_1);
	this.c_tl_tb_tr.appendChild(this.c_tl_tb_td_2);
	this.c_tl_tbody.appendChild(this.c_tl_tb_tr);
	this.c_tl_tb.appendChild(this.c_tl_tbody);
	
	this.toolBar.appendChild(this.c_tl_tb);	
}

//状态栏
Calendar.prototype.status=function(){
	this.status=_create('div');
	this.status.className='CalendarNavigator';
	this.status.id='grid_bottom';
	this.status.colspan='1';
	this.status.style.textAlign="left";
	addEvents(this.status,'mouseover',function(){setScrollTop("down")});
	addEvents(this.status,'mouseout',function(){clearTimeout(timer)})
	this.content.appendChild(this.status);
}
				  
var isToday=function(date){
	var currentDate= new Date();
	if(typeof(date)=='string'){
		date=new Date(date);
	}
	if(currentDate.format("yyyyMMdd")==date.format("yyyyMMdd")){
		return true;
	}
	return false;
}

var isCurrentMonth=function(month){
	var currentDate= new Date();
	
	if(currentDate.format("MM")==month){
		return true;
	}
	return false;
}						  
					  
//设置日历格子里的值
function setEventValue(dt,where){
	
	var w='';
	if(where){
		w=where;
	}
	var year=dt.getFullYear();//年
	var month=dt.getMonth()+1;//月
	var datenum=getDayNumByYearMonth(year,dt.getMonth());              //天数
    var url='?do=subject.base_find_list&year='+year+'&month='+month+'&date='+datenum+w;
	//getEventsByJson(url);
}


//根据年月得到一个月的天数
function getDayNumByYearMonth(year,month){
	var daysInMonth = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
	if(month==1){
		var days=((0==year%4)&&(0!=(year%100)))||(0==year%400)?29:28;
	}else{
		var days=daysInMonth[month];
	}
	return days;
}

function getMdyDateAddMonth(date,addMonth){
	var year=date.getFullYear();
	var month=date.getMonth()+1+addMonth;
	var day=date.getDate();
	
	if(month<1){
		month=12;
		year--;		
	}
	if(month>12){
		month=1;
		year++;	
	}
	var mdy=month+"/"+day+"/"+year;
	return mdy;
}
function getMdyDateAddDay(date,addDay){
	
	var year=date.getFullYear();
	var month=date.getMonth()+1;
	var day=date.getDate()+addDay;
	
	var dayNum=getDayNumByYearMonth(year,month);
	if(day>dayNum){
		day=day-dayNum;	
		month++;
	}
	if(day<1){
		day=dayNum+day;
		month--;	
	}
	if(month<1){
		month=12;
		year--;		
	}
	if(month>12){
		month=1;
		year++;	
	}
	
	var mdy=month+"/"+day+"/"+year;
	return mdy;
}