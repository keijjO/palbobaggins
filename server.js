var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + '/views/';
var http = require('http');

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
  res.sendFile(path + "index.html");
});

router.get("/about",function(req,res){
  res.sendFile(path + "about.html");
});

router.get("/contact",function(req,res){
  res.sendFile(path + "contact.html");
});
router.get("/kartta", function(req,res){
  res.sendFile(path + "testi.html");
});
router.get("/testi", testi);
router.get("/testi2", testi2);
app.use("/",router);


app.listen(3000,function(){
  console.log("Live at Port 3000");
});

function testi(req, res, next) {
	console.log("toinen testi");
	res.redirect("/kartta");
};
function testi2(req,res,next) {
  	var req = http.get("http://www.google.fi", function(res) {
  		console.log('STATUS: ' + res.statusCode);
	});
  	console.log("yee");
  	next();
};