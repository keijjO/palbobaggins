var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + '/views/';
var http = require('http');

//googlemaps api key:   AIzaSyDoZzVrqqQ0q8gES2N10l4qzSZKHS3LXIw
router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});
app.set('view engine', 'ejs'); // set up ejs for templating

router.get("/",function(req,res){
  res.render(path + "weather.ejs");
});

router.get("/karttasivu",function(req,res){
	res.sendFile(path + "karttasivu.html")
});
router.get("/kartta", function(req,res){
  res.sendFile(path + "testi.html");
});
router.get("/saa", function(req, res) {
  res.render(path + "weather.ejs")
});
router.get("/testi", testi);
router.get("/testi2", testi2);
app.use("/",router);

router.get('/weather/', getWeather);

router.get('/nearestcity/', getNearestCity);
router.get('/coordinates', getCoordinates);
router.get('/weatherInCoords', getWeatherInCoords);



app.listen(3000,function(){
  console.log("Live at Port 3000");
});

//käytä näin
//http://localhost:3000/weather?city=tampere
function getWeather(req,res,next){
	console.log("get weather");
	
	//Calls 10min: 600 
	//Calls 1day: 50,000 
	//Threshold: 7,200 
	//Hourly forecast: 5 

	var key = "1cc4e57135b51120a49c601ab2c82ed8";
	var cityName = req.query.city;
	console.log("city " + cityName)
	var options = {
	  host: 'api.openweathermap.org',
	  path: '/data/2.5/weather?q='+cityName+'&APPID=1cc4e57135b51120a49c601ab2c82ed8'
	};
	
	var req = http.get(options, function(rs) {
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
		var celcius = Math.round(bodyJSON.main.temp - 273.15);
		var temperature = celcius + " C";
		res.render('result.ejs', {temp: temperature, city: cityName});
		res.end();
		
	  })
	});
	req.on('error', function(e) {
	 console.log('ERROR: ' + e.message);
	});
		
	
	req.end();
	
};

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
		res.redirect('/weather?city='+city);
		res.end();
		
	  })
	});
	req.on('error', function(e) {
	 console.log('ERROR: ' + e.message);
	});
		
	
	req.end();
	
};
//käytä näin
//http://localhost:3000/coordinates?address=orivedenkatu+3
function getCoordinates(req, res)  {
	var address = req.query.address;
	var http = require("http");
	var lati = 0;
	var longi = 0;
	var options = {
		host: 'maps.google.com',
		path: '/maps/api/geocode/json?address=' + address
	};
	var req = http.get(options, function(rs) {
		var bodyChunks = [];
	  	rs.on('data', function(chunk) {
			// You can process streamed parts here...
			bodyChunks.push(chunk);
		
	  	}).on('end', function() {
			var body = Buffer.concat(bodyChunks);
			console.log('BODY: ' + body);
			var bodyJSON = JSON.parse(body);
			var lati = bodyJSON.results[0].geometry.location.lat;
			var longi = bodyJSON.results[0].geometry.location.lng;
			console.log(lati, longi);
			res.redirect('/nearestcity?lati='+lati+'&longi='+longi);
			res.end();
			
	  })
	});
	req.on('error', function(e) {
	 console.log('ERROR: ' + e.message);
	});
	req.end();
};

function getWeatherInCoords(req, res)  {
	var lat = req.query.lat;
	var lng = req.query.lng;
	res.redirect("/nearestcity?lati="+lat+"&longi="+lng);
	res.end();
	
};





function testi(req, res, next) {
	console.log("toinen testi");
	res.send("jeee");
};
function testi2(req,res,next) {
  	var req = http.get("http://www.google.fi", function(res) {
  		console.log('STATUS: ' + res.statusCode);
	});
  	console.log("yee");
  	next();
};