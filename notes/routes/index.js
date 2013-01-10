
/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render("index", {title: "登录我的记事本"});
};