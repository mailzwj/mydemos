
/*
 * GET users listing.
 */

var db = require("../config").db;
var coll = db.collection("posts");
var df = require("./dateformat").formatDate;
var style = "yyyy-mm-dd hh:ii:ss";

exports.main = function(req, res){
	if(req.session.username){
		var coll = db.collection("posts");
		//req.session.nowtime = new Date().getTime(); //Set Session
		coll.find({username: req.session.username}).sort({"posttime": -1}).limit(20).toArray(function(err, data){
			if(err){
				console.log("Err:" + err);
			}
			res.render('main', {
				title: "NodeJS记事本",
				docTitle: "最近记录的事件列表",
				data: data
			});
		});
	}else{
		res.redirect("/");
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
			res.render("detail", {
				title: data.posttitle,
				data: data
			});
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
				res.render("edit", {
					title: "编辑 ——> " + data.posttitle,
					data: data,
					postId: id
				});
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