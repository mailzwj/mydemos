
/*
 * GET home page.
 */

exports.index = function(req, res){
	var ms = require("mysql");
	var mc = ms.createConnection({
		user: "root",
		password: "admin"
	});
	mc.connect();
	mc.query("use wordpress");
	mc.query("select post_date,post_content,post_name from air_posts", function(err, rs, fields){
		console.log(rs);
		res.render('index', {
			title: 'Express get data from MySql.',
			cons: rs
		});
		mc.end();
	});
};
