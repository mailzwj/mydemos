//得到evnetjson
getEventsByJson=function(url){
	var dk='';
	var c=0;
	$.ajax({
	   type: "GET",
	   url: url,
	   success: function(json){
		 	var dataObj=eval("("+json+")");
			for(var i=0;i<dataObj.length;i++){
				var da=new Date(dataObj[i].date);
				var action=document.createElement('a');
				var pp=document.getElementById("day_"+da.getDate());
				action.href='?do=subject.base_findone&id='+dataObj[i].id;
				action.innerHTML="<br>"+dataObj[i].course;
				if(dk==da.getDate()){
					var more=document.getElementById("mdate");
					if(!more){
						more=document.createElement("div");
						more.id='mdate';
						more.innerHTML='<a>☆更多...<a>';
						pp.appendChild(more);
					}
					continue;		
					
				}
				dk=da.getDate();
				
				var ap=document.createElement('div');	
				var action=document.createElement('a');	
				var teacher=document.createElement('div');	
				var lease=document.createElement('div');	
				var room=document.createElement('div');
				var time=document.createElement('div');
				var dd=document.createElement('div');

				//ap.className='node';
				action.href='?do=subject.base_findone&id='+dataObj[i].id;
				action.innerHTML=dataObj[i].course;
				if(dataObj[i].start_time&&dataObj[i].end_time){
					time.innerHTML=dataObj[i].start_time+"-"+dataObj[i].end_time;
					ap.appendChild(time);
				}
				ap.appendChild(action);
				if(dataObj[i].teacher){
					teacher.innerHTML=dataObj[i].teacher;
					ap.appendChild(teacher);	
				}
				if(dataObj[i].lease){
					lease.innerHTML=dataObj[i].lease;
					if(dataObj[i].room){
						lease.innerHTML+="-"+dataObj[i].room;
					}
					ap.appendChild(lease);
				}
				
				pp.appendChild(ap);
			}
			waitend(); //结束黑屏
	   }
	});
}
//得到Dayevnetjson
getDayEventsByJson=function(url){
	$.ajax({
	   type: "GET",
	   url: url,
	   success: function(json){
		 	var dataObj=eval("("+json+")");
			var pp=document.getElementById("Day_eventList");
				pp.innerHTML='';
			for(var i=0;i<dataObj.length;i++){
				var ap=document.createElement('div');	
				var action=document.createElement('a');	
				var teacher=document.createElement('div');	
				var lease=document.createElement('div');	
				var room=document.createElement('div');
				var start_time=document.createElement('div');
				var end_time=document.createElement('div');
					
				ap.className='node';	
				action.href='?do=subject.base_findone&id='+dataObj[i].id;
				action.innerHTML="【"+dataObj[i].course+"】";
				teacher.innerHTML="任课老师："+dataObj[i].teacher;
				lease.innerHTML="教学点："+dataObj[i].lease;
				room.innerHTML="教室："+dataObj[i].room;
				start_time.innerHTML="上课时间："+dataObj[i].start_time;
				end_time.innerHTML="下课时间："+dataObj[i].end_time;
				
				ap.appendChild(action);
				ap.appendChild(teacher);
				ap.appendChild(lease);
				ap.appendChild(room);
				ap.appendChild(start_time);
				ap.appendChild(end_time);
				pp.appendChild(ap);
				//alert(dataObj[i].date);
				
			}
			//waitend(); //结束黑屏
			
	   }
	});
}
