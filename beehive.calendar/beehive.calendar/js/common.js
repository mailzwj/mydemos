
function goto(url){
		window.location.href=url;
}
//添加事件
function addEvents(obj,eventName,funName){
	if(window.addEventListener){
		obj.addEventListener(eventName,funName,false);
	}else{	
		obj.attachEvent('on'+eventName,funName);
	}
}

var isIE=function(){
	if (window.XMLHttpRequest&&!window.ActiveXObject) { 
		return false;
	}
	return true;
}
function getOffsetY(event){
	if (isIE()){
		return event.offsetY;
	}else{
		return event.layerY;	
	}
}
function getOffsetX(event){
	if (isIE()){
		return event.offsetX;
	}else{
		return event.layerX;	
	}
}
function getEventObj(event){
	if (isIE()){
		return event.srcElement;
	}else{
		return event.target;
	}
}
function getWinWidth(){
	this.winWidth;
	if(window.innerWidth){
		this.winWidth=window.innerWidth;
	}else if((document.body)&&(document.body.clientWidth)){
		this.winWidth=document.body.clientWidth;
	}
	
	if(document.documentElement && document.documentElement.clientWidth){
		this.winWidth=document.documentElement.clientWidth;
	}
	return this.winWidth;
}

function getWinHeight(){
	this.winHeight;
	if(window.innerHeight){
		this.winHeight=window.innerHeight;
	}else if((document.body)&&(document.body.clientHeight)){
		this.winHeight=document.body.clientHeight;
	}
	
	if(document.documentElement && document.documentElement.clientHeight){
		this.winHeight=document.documentElement.clientHeight;
	}
	return this.winHeight;
}
//格式化日期
Date.prototype.format=function(fmt){
	var o={
			"M+":this.getMonth()+1,
			"d+":this.getDate(),
			"h+":this.getHours(),
			"m+":this.getMinutes(),
			"s+":this.getSeconds(),
			"q+":Math.floor( (this.getMonth()+3)/3 ),  //季度
			"s+":this.getMilliseconds() //毫秒
		};
	if(/(y+)/.test(fmt))
	fmt=fmt.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length));
	for(var k in o){
		if(new RegExp("("+k+")").test(fmt))
		fmt=fmt.replace(RegExp.$1,(RegExp.$1.length==1)?(o[k]):(("00"+o[k]).substr((""+o[k]).length)));	
	}		
	return fmt;
}
Date.prototype.addDays=function(d){
	this.setDate(this.getDate()+d);	
}
function addDays(date,d){
	var newdate=new Date(date.format("MM/dd/yyyy"))
	newdate.setDate(newdate.getDate()+d);
	return newdate;	
}
Date.prototype.addWeeks=function(w){
	this.addDays(w*7);	
}
Date.prototype.addMonths=function(m){
	var d=this.getDate();
	this.setMonth(this.getMonth()+m);
	if(this.getDate()<d){
		this.setDate(0); // 取上个月的最后一天	
	}
}
Date.prototype.addYears=function(y){
	var m=this.getMonth();
	this.setFullYear(this.getFullYear()+y);
	if(m<this.getMonth()){
		this.setDate(0);  // 取上个月的最后一天	
	}	
}
//ID选择器
function _(id){
	this.domObj=document.getElementById(id);
	if(!this.domObj) return;
	this.domObj.addClass = function(className){
		var elementClassName = this.className;
		if (elementClassName.length == 0)
		{
			this.className = elementClassName;
			return;
		}
		if (elementClassName == className || elementClassName.match(new RegExp("(^|\\s)" + className + "(\\s|$)")))
			return;
		this.className = elementClassName + " " + className;
	}
	this.domObj.removeClass = function(className)
	{
		var elementClassName = this.className;
		if (elementClassName.length == 0) return;
		if(elementClassName == className)
		{
			this.className = "";
			return;
		}
		if (elementClassName.match(new RegExp("(^|\\s)" + className + "(\\s|$)")))
			this.className = elementClassName.replace((new RegExp("(^|\\s)" + className + "(\\s|$)"))," ");
	}
	this.domObj.hasClass = function(className)
	{
		var elementClassName = this.className;
		if (elementClassName.length == 0) return false;
		//用正则表达式判断多个class之间是否存在真正的class（前后空格的处理）
		if (elementClassName == className || elementClassName.match(new RegExp("(^|\\s)" + className + "(\\s|$)")))
		  return true;
		return false;
	}
	return this.domObj;
}
function _n(name){
	return document.getElementsByTagName(name);
}

function _c(object, tag, className) {
	var o = object.getElementsByTagName(tag);
	for ( var i = 0, n = o.length, ret = []; i < n; i++)
		if (o[i].className == className) ret.push(o[i]);
	if (ret.length == 1) ret = ret[0];
	return ret;
}
function _create(tag){
	return document.createElement(tag);	
}
function isArray(v) { 
  return Object.prototype.toString.apply(v) === '[object Array]'; 
} 
function isObject(v) { 
  return Object.prototype.toString.apply(v) === '[object Object]'; 
} 

