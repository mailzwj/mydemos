/**
 * 解析get方法的请求字符串
 */
/*
var http = require("http");
var url = require("url");
var util = require("util");

http.createServer(function(req, res){
	res.writeHead(200, {"Content-Type": "text/plain"});
	res.end(util.inspect(url.parse(req.url, true)));
}).listen(3000);
*/

/**
 * http request method
 * 不知为何不能运行...
 */
var http = require("http");
var qs = require("querystring");

var contents = qs.stringify({
	name: "byvoid",
	email: "byvoid@byvoid.com",
	address: "HangZhou, ZheJiang, China."
});

var options = {
	host: "127.0.0.1",
	path: "/index.php",
	method: "POST",
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Length': contents.length
	}
};

var req = http.request(options, function(res){
	res.setEncoding("utf8");
	res.on("data", function(data){
		console.log(data);
	});
});

req.write(contents);
req.end();

