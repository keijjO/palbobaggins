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

//router.get("/weather", getWeather)

router.get(/nearestcity/, getNearestCity)

app.listen(3000,function(){
  console.log("Live at Port 3000");
});

/* function getWeather(req,res,next){
	console.log("get weather called");
	var YQL = require('yql');

	var query = new YQL('select * from weather.forecast where (location = 94089)');

	query.exec(function(err, data) {
	  var location = data.query.results.channel.location;
	  var condition = data.query.results.channel.item.condition;
	  
	  console.log('The current weather in ' + location.city + ', ' + location.region + ' is ' + condition.temp + ' degrees.');
	});
} */

//käytä näin
//http://localhost:3000/getnearestcity?lati=62.614806&longi=28.618057
function getNearestCity(req,res,next){
	console.log("get nearest city");
	var key="AIzaSyCkYwq88Z6EjbAUpeXxXbGEBYJyQHvVH7g"
	var lati = req.query.lati;
	var longi = req.query.longi;
	var https = require('https');
	console.log("lati" + lati +"longi" +longi)
	var options = {
	  host: 'maps.googleapis.com',
	  path: '/maps/api/place/nearbysearch/json?location='+lati+',%20'+longi+'&type=cities&radius=50000&key=AIzaSyCkYwq88Z6EjbAUpeXxXbGEBYJyQHvVH7g'
	};
	
	var req = https.get(options, function(rs) {
	  console.log('STATUS: ' + res.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(res.headers));

	  // Buffer the body entirely for processing as a whole.
	  var bodyChunks = [];
	  rs.on('data', function(chunk) {
		// You can process streamed parts here...
		bodyChunks.push(chunk);
		
	  }).on('end', function() {
		var body = Buffer.concat(bodyChunks);
		console.log('BODY: ' + body);
		var bodyJSON = JSON.parse(body);
		var city = bodyJSON.results[0].name;
		//console.log(city);
		res.write(city);
		res.end();
		
	  })
	});
	req.on('error', function(e) {
	 console.log('ERROR: ' + e.message);
	});
		
	
	req.end();
	
}

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