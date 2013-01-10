
/*
 * GET home page.
 */

exports.index = function(req, res){
	var db = require("../config").db;
	var df = require("./dateformat").formatDate;
	var coll = db.collection("posts");
	coll.find().sort({"posttime": -1}).limit(20).toArray(function(err, data){
		if(err){
			console.log("Err:" + err);
		}
		res.render('index', {
			title: "NodeJS记事本",
			docTitle: "最近记录的事件列表",
			data: data
		});
	});
};