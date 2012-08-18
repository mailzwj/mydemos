Calendar.prototype.header=function(){
	this.c_h_tb=_create('table');
	this.c_h_tbody=_create('tbody');
	this.c_h_tb_tr=_create('tr');
	this.c_h_tb_td_l=_create('td');
	this.c_h_tb_th=_create('th');
	this.c_h_tb_td_c=_create('td');
	this.c_h_tb_td_r=_create('td');
	this.c_h_tb_td_img=_create('img');
	this.c_h_tb_td_img2=_create('img');
	this.c_h_tb.className='Header';	
	this.c_h_tb.cellspacing='0';
	this.c_h_tb.cellpadding='0';
	this.c_h_tb.border='0';
	this.c_h_tb_td_l.className='HeaderLeft';
	this.c_h_tb_td_r.className='HeaderRight';
	this.c_h_tb_td_img.src='images/Spacer.gif';
	this.c_h_tb_td_img2.src='images/Spacer.gif';
	this.c_h_tb_td_c.className='tbg';
	
	this.hid=_create('input');
	this.hid_rday=_create('input');
	this.hid_rday.type='hidden';
	this.hid_rday.id='rday';
	this.hid.type='hidden';
	this.hid.value=this.date.format("MM/dd/yyyy");
	this.hid.id='date';
	
	if(this.language.type=='chinese'){
		this.c_h_tb_th.innerHTML='<a class="br10" >'+(this.date.getFullYear())+'</a> '+this.language.year
								+' <a class="br10">'+(this.date.getMonth()+1)+'</a> '+this.language.month;
	}else{
		this.c_h_tb_th.innerHTML=(this.date.getFullYear())+' '+this.language.monthArray[this.date.getMonth()];
	}
	
	this.c_h_tb_td_l.appendChild(this.c_h_tb_td_img);
	this.c_h_tb_td_r.appendChild(this.c_h_tb_td_img2);
	
	this.c_h_tb_sz=_create('a');
	this.c_h_tb_sz.className='c_sz';
	this.c_h_tb_td_c.appendChild(this.c_h_tb_sz);
	this.c_h_tb_td_c.appendChild(this.hid);
	this.c_h_tb_td_c.appendChild(this.hid_rday);
	this.c_h_tb_tr.appendChild(this.c_h_tb_td_l); 
	this.c_h_tb_tr.appendChild(this.c_h_tb_th); 
	this.c_h_tb_tr.appendChild(this.c_h_tb_td_c); 
	this.c_h_tb_tr.appendChild(this.c_h_tb_td_r); 
	this.c_h_tbody.appendChild(this.c_h_tb_tr);
	this.c_h_tb.appendChild(this.c_h_tbody);
	
	this.content.appendChild(this.c_h_tb);
}

Calendar.prototype.list=function(){
	this.c_h_tb=_create('table');
	this.c_h_tbody=_create('tbody');
	this.c_h_tb_tr_top=_create('tr');
	this.c_h_tb_td_top=_create('td');
	this.c_h_tb_td_top.valign='top';
	
	this.c_h_tb.className='Calendar';
	this.grid=new GridList(this.date,this.language);
	this.c_h_tb_td_top.appendChild(this.grid);
	this.c_h_tb_tr_top.appendChild(this.c_h_tb_td_top);
	this.c_h_tbody.appendChild(this.c_h_tb_tr_top);
	this.c_h_tb.appendChild(this.c_h_tbody);
	
	this.content.appendChild(this.c_h_tb);
}



//日历 单元格子天的集合
var GridList=function(date,language){
	this.c_g_tb=_create('table');
	this.c_g_tbody=_create('tbody');
	this.c_g_tb.className='Grid';
			
	//5行
	this.day=0;  //1-31天
		
	this.date=new Date(date.format("MM/01/yyyy")); 
	this.w=this.date.getDay();
	this.year=this.date.getFullYear();
	this.month=this.date.getMonth();
	this.days=0;
	this.days=getDayNumByYearMonth(this.year,this.month);
	this.week = language.weekArray;
	this.ndate=new Date();
	
	var H=parseInt(400)/5;
	
	for(var i=0;i<6;i++){
		this.c_g_tr=_create('tr');
		
		if(i==0){
			//7列
			for(var j=0;j<7;j++){
				this.c_g_td=_create('td');
				this.c_g_td.className='CalendarWeekendName';
				this.c_g_td.style.width='14.29%';
				this.c_g_td.innerHTML=this.week[j];
				this.c_g_td.style.background='#eee'; 
				this.c_g_tr.appendChild(this.c_g_td);
			}
		}else{
			this.c_g_tr.className="grid-tr";	
			this.c_g_tr.style.height=(getWinHeight()-95)/5+'px';
			for(var j=0;j<7;j++){
				
				var gtd=new Grid_td(language,this.year,this.month,this.day,this.date,this.ndate,i,j,this.w,this.days);
				this.day=gtd.day;
				this.c_g_tr.appendChild(gtd.c_g_td);
				
			}
		}
		this.c_g_tbody.appendChild(this.c_g_tr);
	}
	this.c_g_tb.appendChild(this.c_g_tbody);
	return this.c_g_tb;	
}
var Grid_td=function(language,year,month,day,date,ndate,i,j,w,days){
	this.c_g_td=_create('td');
	this.c_g_td.className='CalendarWeekend';
	this.c_g_td.style.verticalAlign='top';
	this.c_g_td.style.textAlign='left';
	
	this.day; 
	
	var g='';
	
	if(i==1&&j>=w){
		day++;
		var lunarhtml='';
		if(language.type=='chinese'){
			var lunar=lunarday((month+1)+'//'+day+'//'+year);
			var lunarhtml="  <font color='#777' style='font-size:8px'>"+lunar+"</font>";
		}
		this.c_g_td.id='day_'+day;
		var g="<div class='day_d' ><a class='day_num'>"+day+"</a>"+lunarhtml+
		"</font><a class='add_event'  id='add_"+day+"'><img src='images/add.gif' onclick=showModalDialog('"+date.format('MM/'+day+'/yyyy')+"',18,34) ><a/></div>";
	}else if(i>1&&day<days){
		day++;
		var lunarhtml='';
		if(language.type=='chinese'){
			var lunar=lunarday((month+1)+'//'+day+'//'+year);
			var lunarhtml="&nbsp;&nbsp;<font color='#777' style='font-size:8px'>"+lunar+"</font>";
		}
		this.c_g_td.id='day_'+day;
		var g="<div class='day_d' ><a class='day_num'>"+day+"</a>"+lunarhtml+
		"</font><a class='add_event'  id='add_"+day+
		"'><img src='images/add.gif' onclick=showModalDialog('"+date.format('MM/'+day+'/yyyy')+"',18,34) ><a/></div>";
	}else{
		var g=" "
		this.c_g_td.style.background='#eeeeee'; 
	}
	
	addEvents(this.c_g_td,'click',function(){get_day(day)});
	this.day=day;
	
	this.c_g_td.innerHTML=g;
	if(isToday(date.format('MM/'+day+'/yyyy'))){
		this.c_g_td.className+=" today"; 
	}
	return this;
}




//
function addevent(day){

	var url='?do=subject.view&op=add';
	var d=_('date');
	var date=new Date(d.value);
	var d_day=day>9?day:'0'+day; 
	var d_month=(date.getMonth()+1)>9?(date.getMonth()+1):'0'+(date.getMonth()+1);
	var time='&sdate='+date.getFullYear()+'-'+d_month+'-'+d_day;
	//alert(time);
	//showdialog('添加课程',url+time);
	goto(url+time);
}
function get_day(day){
	
	if(!_('day_'+day)) return;
	
	_('day_'+day).addClass('day_pc');
	var rday=_("rday");
	var d=rday.value;
	_("add_"+day).style.display='block';
	
	//clickDay(d_a[1]);
	
	var da=_('date');
	var date=new Date(da.value);
	var month= date.getMonth()+1;
	var year=date.getFullYear();
	
	if(d){
		
		if(d!=('day_'+day)){
			_(d).removeClass('day_pc');
			var d_a_l=d.split("_");
			_("add_"+d_a_l[1]).style.display='none';
			_("rday").value='day_'+day;
		}
	}else{
		_("rday").value='day_'+day;		
	}
	
	// 通过url得到 一天的事件
	//var url='?do=subject.getDay&year='+year+'&month='+month+'&date='+d_a[1];
	//getDayEventsByJson(url);
}


//显示点击的一天课程
clickDay=function(day){
	var t=_("eventbyDay");
	var d=_('date');
	var date=new Date(d.value);
	
	t.innerHTML=(date.getMonth()+1)+"月"+day+"日";
}

//下一个月
Next=function(){
		var d=_('date');
		var date=new Date(d.value);
			date.addMonths(1);
		gotoMonth(date);
}
//上一个月
Prev=function(){
	var d=_('date');
	var date=new Date(d.value);
		date.addMonths(-1);
	gotoMonth(date);	
	
}

//跳转到某月
var gotoMonth=function(date){
	
	var lang='english';
	var languageobj=_('hidden_language');
	if(languageobj){ lang=languageobj.value;}
	
	try{
		var cr=new Calendar();
			cr.date=date;
			cr.language=new Language(lang);

			cr.load();
		
		
	}catch(e){
		alert(e);	
	}
}


