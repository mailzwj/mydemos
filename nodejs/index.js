var http = require("http");
var ev = require("events");

http.createServer(function(req, res){
	res.write("<!DOCTYPE HTML>\n\n");
	res.write("<html>\n");
	res.write("<head>\n");
	res.write("<meta charset=\"UTF-8\">\n");
	res.write("<title>NodeJS 入门</title>\n");
	res.write("</head>\n");
	res.write("<body>\n");
	res.write("Hello Word!" + "First Node Program!");
	res.write("\n</body>\n");
	res.end("</html>");
	console.log(req.headers.host);
}).listen(8088);

/*document.on("click", function(){
	http.get({host: "127.0.0.1", port: 8088, path: "server.html"}, function(response){
		document.getElementsByTagName("body")[0].innerHTML = response.content;
	}).on("error", function(e){
		console.log("Got Error:" + e.message);
	});
});*/

console.log("Server is Running at http://127.0.0.1:8088/");
