
/*
 * GET users listing.
 */

var db = require("../config").db;
var coll = db.collection("posts");
var df = require("./dateformat").formatDate;
var style = "yyyy-mm-dd hh:ii:ss";
var crypto = require("crypto");

exports.main = function(req, res){
	if(req.session.username){
		var coll = db.collection("posts");
		//req.session.nowtime = new Date().getTime(); //Set Session
		coll.find({username: req.session.username}).sort({"posttime": -1}).limit(20).toArray(function(err, data){
			if(err){
				console.log("Err:" + err);
			}
			if(data.length > 0){
				res.render('main', {
					title: "NodeJS记事本",
					docTitle: "最近记录的事件列表",
					data: data
				});
			}else{
				res.render('main', {
					title: "NodeJS记事本",
					docTitle: "最近记录的事件列表",
					data: data,
					errinfo: "还有记事记录，赶紧添加记事吧"
				});
			}
		});
	}else{
		res.redirect("/");
	}
};

exports.reg = function(req, res){
	var _name = req.body.newuser;
	var _pwd = req.body.newpwd;
	var _rpwd = req.body.repwd;
	//console.log(_name);
	if(_pwd !== _rpwd){
		res.redirect("/reg");
	}
	var users = db.collection("user");
	if(_pwd){
		var md5 = crypto.createHash("md5");
		md5.update(_pwd);
		users.findOne({username: _name}, function(err, data){
			if(data){
				res.render("reg", {title: "注册新用户", errinfo: "用户名已存在"});
			}else{
				users.insert({username: _name, password: md5.digest("hex"), level: 1}, function(err){
					if(err){
						console.log("Err:" + err);
						res.redirect("/reg");
					}else{
						res.redirect("/");
					}
				});	
			}
		});
	}else{
		res.render("reg", {title: "注册新用户"});
	}
};

exports.show = function(req, res){
	if(req.session.username){
		var id = req.params.id;
		//var nt = req.session.nowtime; //Get Session
		coll.update({_id: coll.id(id)}, {$inc:{"clicknum": 1}});
		coll.findOne({_id: coll.id(id), username: req.session.username}, function(err, data){
			if(err){
				console.log("Err:" + err);
			}
			if(data){
				res.render("detail", {
					title: data.posttitle,
					data: data
				});
			}else{
				res.render("detail", {
					title: "查看详细记事",
					data: data,
					errinfo: "该记事不存在"
				});
			}
		});
	}else{
		res.redirect("/");
	}
};

exports.add = function(req, res){
	if(req.session.username){
		var _name = req.query.postname;
		var _con = req.query.postcon;
		if(_name){
			coll.save({"posttitle": _name, "postcontent": _con, "posttime": df(new Date(), style), "uptime": df(new Date(), style), "clicknum": 0, "username": req.session.username}, function(err){
				if(err){
					console.log("Err:" + err);
					res.redirect("./add");
				}else{
					res.redirect("/");
				}
			});
		}else{
			res.render("add", {title: "新增记事"});
		}
	}else{
		res.redirect("/");
	}
};

exports.edit = function(req, res){
	if(req.session.username){
		var id = req.params.id;
		var _name = req.query.postname;
		var _con = req.query.postcon;
		if(_name){
			coll.update({_id: coll.id(id), username: req.session.username}, {$set:{"posttitle": _name, "postcontent": _con, "uptime": df(new Date(), style)}}, function(err){
				if(err){
					console.log("Err:" + err);
					res.redirect("./edit/" + id);
				}else{
					res.redirect("/");
				}
			});
		}else{
			coll.findOne({_id: coll.id(id), username: req.session.username}, function(err, data){
				if(err){
					console.log("Err:" + err);
				}
				if(data){
					res.render("edit", {
						title: "编辑 ——> " + data.posttitle,
						data: data,
						postId: id
					});
				}else{
					res.render("edit", {
						title: "编辑 ——> 记事",
						errinfo: "未找到该条记事",
						data: data,
						postId: ""
					});
				}
			});
		}
	}else{
		res.redirect("/");
	}
};

exports.del = function(req, res){
	if(req.session.username){
		var id = req.params.id;
		coll.remove({_id: coll.id(id), username: req.session.username}, function(err){
			if(err){
				console.log("Err:" + err);
			}
			res.redirect("/");
		});
	}else{
		res.redirect("/");
	}
};