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

//vedenlaatu
router.get(/vedenlaatu/i, haeVedenlaatuApista)

router.get("/paikka", haeKaikkiPaikat)


app.listen(3000,function(){
  console.log("Live at Port 3000");
});

function haeKaikkiPaikat(req,res,next){
	var options = {
	  host: 'rajapinnat.ymparisto.fi',
	  path: '/api/vesla/1.0/Paikka'
	};
	
	var req = http.get(options, function(rs) {
	  console.log('STATUS: ' + res.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(res.headers));

	  // Buffer the body entirely for processing as a whole.
	  var bodyChunks = [];
	  rs.on('data', function(chunk) {
		// You can process streamed parts here...
		bodyChunks.push(chunk);
		res.write(chunk);
	  }).on('end', function() {
		var body = Buffer.concat(bodyChunks);
		console.log('BODY: ' + body);
		res.end();
		
	  })
	});
	req.on('error', function(e) {
	 console.log('ERROR: ' + e.message);
	});
		
	
	req.end();
}
function haeVedenlaatuApista(req,res,next){
	console.log("haeVedenlaatuApista kutsuttu" + req.method);
	res.contentType('application/json');
	var Body;
	var CoordNorth = req.query.CoordNorth;
	var CoordEast = req.query.CoordEast;
	console.log('North ' + req.query.CoordNorth);
	var options = {
	  host: 'rajapinnat.ymparisto.fi',
	  path: '/api/vesla/1.0/Site_Wide?%24filter=CoordYKJ_North%20eq%'+CoordNorth+'%20and%20CoordYKJ_East%20eq%'+CoordEast+'&%24select=Site_Id,Name,CoordYKJ_North,CoordYKJ_East'
	};
	
	var req = http.get(options, function(rs) {
	  console.log('STATUS: ' + res.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(res.headers));

	  // Buffer the body entirely for processing as a whole.
	  var bodyChunks = [];
	  rs.on('data', function(chunk) {
		// You can process streamed parts here...
		bodyChunks.push(chunk);
		res.write(chunk);
	  }).on('end', function() {
		var body = Buffer.concat(bodyChunks);
		console.log('BODY: ' + body);
		res.end();
		
	  })
	});
	req.on('error', function(e) {
	 console.log('ERROR: ' + e.message);
	});
		
	
	req.end();
	
};

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