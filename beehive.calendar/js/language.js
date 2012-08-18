var Language=function(language){
	
	if(language=='chinese') this.language=chinese;
	else this.language=english;
	this.language.timeArray= new Array(12,1,2,3,4,5,6,7,8,9,10,11,12,1,2,3,4,5,6,7,8,9,10,11);
	this.language.time12hm=new Array('12:00 am','12:30 am','1:00 am','1:30 am','2:00 am','2:30 am',
									 '3:00 am','3:30 am','4:00 am','4:30 am','5:00 am','5:30 am',
									 '6:00 am','6:30 am','7:00 am','7:30 am','8:00 am','8:30 am',
									 '9:00 am','9:30 am','10:00 am','10:30 am','11:00 am','11:30 am',
									 '12:00 pm','12:30 pm','1:00 pm','1:30 pm','2:00 pm','2:30 pm',
									 '3:00 pm','3:30 pm','4:00 pm', '4:30 pm','5:00 pm','5:30 pm',
									 '6:00 pm','6:30 pm','7:00 pm','7:30 pm','8:00 pm','8:30 pm',
									 '9:00 pm','9:30 pm','10:00 pm','10:30 pm','11:00 pm','11:30 pm','12:00 pm','12:30 pm');
	return this.language;	 
}
var chinese={
			'type':'chinese',
			'weekArray':new Array("星期日","星期一", "星期二", "星期三", "星期四", "星期五", "星期六"),
			'week':'周',
			'year':'年',
			'month':'月',
			'day':'日',
			'date':'日期',
			'title':'标题',
			'content':'内容',
			'event':'事件',
			'create_action':'创建事件',
			'edit_detail':'编辑活动详细信息',
			'today':'今天'
		};
	var english={
			'type':'english',
			'weekArray':new Array('Sunday', 'Monday','Tuesday','Wednesday', 'Thursday', 'Friday','Saturday'),
			'monthArray':new Array('January','February','March','April','May','June','July','August','September','October','November','December'),
			'week':'Week',
			'year':'Year',
			'month':'Month',
			'day':'Day',
			'date':'Date',
			'title':'Title',
			'content':'Content',
			'event':'Event',
			'create_action':'Create Event',
			'edit_detail':'Edit Detail',
			'today':'Today'
					  
		};
var Time_hm=new Array('12:00 am','12:30 am','1:00 am','1:30 am','2:00 am','2:30 am','3:00 am','3:30 am','4:00 am','4:30 am','5:00 am',
					  '5:30 am','6:00 am','6:30 am','7:00 am','7:30 am','8:00 am','8:30 am','9:00 am','9:30 am','10:00 am','10:30 am',
					  '11:00 am','11:30 am','12:00 pm','12:30 pm','1:00 pm','1:30 pm','2:00 pm','2:30 pm','3:00 pm','3:30 pm','4:00 pm',
					  '4:30 pm','5:00 pm','5:30 pm','6:00 pm','6:30 pm','7:00 pm','7:30 pm','8:00 pm','8:30 pm','9:00 pm','9:30 pm',
					  '10:00 pm','10:30 pm','11:00 pm','11:30 pm','12:00 pm','12:30 pm');		