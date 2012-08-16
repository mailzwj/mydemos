var down=false; //判断鼠标是否处于down状态
var y=0;//对象top坐标
var t=0;//时间坐标
var h=0;//对象的height 高度
var w=0;//方向0向下1向下
var m=0;//移动的值

var current_obj, is_current_obj=false; //选择的对象
var current_date; //选择的时间
var resize_obj, resize_down=false; //改动大小的对象
var state_obj=false;
 
var timer;  //定时器

//鼠标按下事件
function downEvent(day,event){
			
		state_obj=false;  
		down=true;       
		current_date=day;
		
		var isdownObj=false;  //是否是按下的对象
		  
			
		this.event_div=_create('div');
		this.event_time_div=_create('div');
		this.event_content_div=_create('div');
		this.resize_div=_create('div');
		
		this.event_div.className='wc-cal-event ui-corner-all br4';			   
		this.event_time_div.className='wc-time ui-corner-all br4';
		this.resize_div.className='ui-resizable-handle ui-resizable-s';	
		
		
		
		m=getOffsetY(event);
		
		y=parseInt(getOffsetY(event)/20)*20;
		t=parseInt(getOffsetY(event)/20)+1;
		current_obj=getEventObj(event);
		if(getEventObj(event)==_(day+'_week')){
			isdownObj=true;
			is_current_obj=true;
		}
		
		if(isdownObj){
	
			this.event_div.style.top=y+'px';
			var date=new Date(day);
			var d=new Date();
			
			var ndate=new Date((d.getMonth()+1)+'/'+d.getDate()+'/'+d.getFullYear());
			if(!(date>=ndate)){
				this.event_div.style.backgroundColor ='#aaa';
			}
			
			this.event_div.id=day+''+y+'_event_div';
			this.event_time_div.id=day+''+y+'_event_time';
			this.event_content_div.id=day+''+y+'_event_content';
			this.event_div.appendChild(this.event_time_div);
			this.event_div.appendChild(this.event_content_div);
				addEvents(this.resize_div,'mousedown',function(event){resize_downEvent(day,event); });
			this.event_div.appendChild(this.resize_div);
			
			_(day+'_week').appendChild(this.event_div);
		}
}
//鼠标在日历上拖动事件
function moveEvent(day,event){
	var child_y=0;       //event 触发到子对象的时候的 y坐标值
	var child_h=0;       //event 触发到子对象的时候的 height值
	var isdownObj=false; //判断触发是对象是否是当前操作的对象 
	document.body.style.cursor="pointer";
	if(down){
		h=getOffsetY(event)-y;
		isdownObj=true;
		is_current_obj=true;
		
		//如果鼠标上的对象是_(day+''+y+'_event_div')
		if(getEventObj(event)==_(day+''+y+'_event_div')){
			 h=getOffsetY(event);
		}
		if(current_obj!=_(day+'_week')){
			is_current_obj=false;
		}
		if("wc-time-slot"==getEventObj(event).className){
			is_current_obj=false;
		}
		
		if(isdownObj){
			h=h<=0?0:Math.ceil(h/20)*20;
			child_y=Math.ceil(child_y/20)*20;
			
			if(getOffsetY(event)-5<=h+y){
				h-=20;
			}
			if(_(current_date+''+y+'_event_div')){
			   _(current_date+''+y+'_event_div').style.height=(h+child_y)+'px';
			}
		}
		t=(h+y)/20;
		m=getOffsetY(event);
		
		
	}
	
	
	//判断从底部拖动改变大小
	if(resize_down){
			is_current_obj=true;
			if(resize_obj.parentNode==_(day+'_week')){
				 y=parseInt(resize_obj.style.top);
				 h=getOffsetY(event)-y;
				 h=h<=0?0:Math.ceil(h/20)*20;
				 
				
				 if(getOffsetY(event)-5<=h+y) h-=20;
				 t=(h+y)/20;
				 
				 resize_obj.style.height=h+'px';
			}
			
			
	}
	
}

//鼠标松开事件
function upEvent(day,event){
	
	
	if(!is_current_obj){
		del_current_obj();	
		return ;
	}
	
	if(_(current_date+''+y+'_event_time')){
		_(current_date+''+y+'_event_time').innerHTML=Time_hm[y/20]+' to '+Time_hm[t];
	}
	if(_(current_date+''+y+'_event_div')){
		
		if(parseInt(_(current_date+''+y+'_event_div').style.height)<1){
			del_current_obj();	
			return ;
		}
		showModalDialog(current_date,y/20,t);
		state_obj=true;
	}
	
	down=false;
	resize_down=false;
	y=0;
}

function setScrollTop(op){
	
	if(!down) return 
	var grid=_c(document,"div","wc-scrollable-grid");
	if(op=="up"){
		grid.scrollTop-=10;
	}else if(op=="down"){
		grid.scrollTop+=10;
		//alert('ddddddddd');
	}
	//_("tool").innerHTML=grid.scrollBottom;
	timer=setTimeout("setScrollTop('"+op+"')",100)	
}

//删除未创建完成的对象
function del_current_obj(){
	if(_(current_date+''+y+'_event_div')){
		_(current_date+''+y+'_event_div').parentNode.removeChild(_(current_date+''+y+'_event_div'));
	}
}

function resize_downEvent(day,event){	
	resize_down=true;
	resize_obj=getEventObj(event).parentNode;
}

//窗体上鼠标点击释放触发事件
window.onmouseup=function(){
	down=false;
	if(!state_obj)
	del_current_obj();
}

var wc_scrollable_grid=false;
var grid_tr=false;
//窗体大小改变触发事件
window.onresize=function(){
	if(!wc_scrollable_grid)
		wc_scrollable_grid=_c(document,"div",'wc-scrollable-grid');
	if(!grid_tr)
		grid_tr=_c(document,"tr","grid-tr");
	
	if(_("tab_input").value=="month"){
		for(var i=0 ;i<grid_tr.length; i++ )
		{
			grid_tr[i].style.height=(getWinHeight()-95)/5+'px';
		}
	}else if(_("tab_input").value=="week"){
		wc_scrollable_grid.style.height=(getWinHeight()-95)+'px';
	}else if(_("tab_input").value=="day"){
		wc_scrollable_grid.style.height=(getWinHeight()-69)+'px';
	}
}

function showModalDialog(day,beginTime,endTime){
	createBlackBg();
	this.dialog=_create('div');	
	this.dialog.className='dialog bs br10';
	this.header=_create('div');
	this.closeimg=_create('div');
	this.bar=_create('div');
	
	var lang=new Language(_('hidden_language').value);
	
	this.dialog.style.top=(getWinHeight()/2-120)+'px';
	this.dialog.style.left=(getWinWidth()/2-200)+'px';
	this.closeimg.className='close';
	this.closeimg.innerHTML="<img onclick=closeModalDialog("+day+") src='images/close2.gif'>";
	this.bar.className='bar';
	this.bar.innerHTML=lang.event;
	this.form=_create('form');
	this.time=_create('div');
	this.title=_create('div');
	this.content=_create('div');
	this.btu=_create('div');
	var date=new Date(day);
	
	this.time.innerHTML=lang.date+' '+date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+" ("
						+lang.weekArray[date.getDay()]+"),  "+Time_hm[beginTime]+" – "+Time_hm[endTime];
	this.title.innerHTML="<p>"+lang.title+":</p> <input type='text'>";
	this.content.innerHTML="<p>"+lang.content+":</p> <textarea></textarea> <hr />";
	this.btu.innerHTML="<input type='button' value='"+lang.create_action
					   +"' onclick='closeModalDialog()' /> <a>"+lang.edit_detail+"</a>";
					   
		 
	this.dialog.appendChild(this.bar);
	this.dialog.appendChild(this.closeimg);
	this.form.appendChild(this.time);
	this.form.appendChild(this.title);
	this.form.appendChild(this.content);
	this.form.appendChild(this.btu);
	this.dialog.appendChild(this.form);
	_('append').appendChild(this.dialog);
}

function closeModalDialog(){
	_('append').innerHTML='';	
}
function createBlackBg(){
	this.bg=_create('div');	
	this.bg.className='blackBg';
	_('append').appendChild(this.bg);
}
