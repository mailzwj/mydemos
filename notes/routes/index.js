
/*
 * GET home page.
 */

var db = require("../config").db;
var coll = db.collection("user");
exports.index = function(req, res){
    if(!req.session.username){
        var _user = req.query.username;
        var _pwd = req.query.userpwd;
        if(_pwd){
            coll.findOne({username: _user, password: _pwd}, function(err, data){
                if(err){
                    console.log("Err:" + err);
                }
                if(data && data.username){
                    req.session.username = data.username;
                }
                res.redirect("/");
            });
        }else{
            res.render("index", {title: "登录我的记事本"});
        }
    }else{
        res.redirect("/main");
    }
};
