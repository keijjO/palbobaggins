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
app.use("/",router);

router.get('/weather/', getWeather);

router.get('/nearestcity/', getNearestCity);
router.get('/coordinates', getCoordinates);
router.get('/weatherInCoords', getWeatherInCoords);
router.get('/lakes',getNearestLakes);
router.get('/kunta', getNearestKunta);


var port = process.env.PORT || 8080;
app.listen(port,function(){
  console.log("Live at Port "+ port);
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
	var kunta = req.query.kunta;
	console.log("city " + cityName)
	var options = {
	  host: 'api.openweathermap.org',
	  path: '/data/2.5/weather?q='+cityName+'&APPID=1cc4e57135b51120a49c601ab2c82ed8'
	};
	
	var req = http.get(options, function(rs) {
	  //console.log('STATUS: ' + res.statusCode);
	  //console.log('HEADERS: ' + JSON.stringify(res.headers));

	  // Buffer the body entirely for processing as a whole.
	  var bodyChunks = [];
	  rs.on('data', function(chunk) {
		// You can process streamed parts here...
		bodyChunks.push(chunk);
		
	  }).on('end', function() {
		var body = Buffer.concat(bodyChunks);
		//console.log('BODY: ' + body);
		var bodyJSON = JSON.parse(body);
		var celcius = Math.round(bodyJSON.main.temp - 273.15);
		var temperature = celcius + " C";
		res.redirect('/lakes?city='+cityName+'&temp='+temperature+'&kunta='+kunta);
		res.end();
		return;
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
	var kunnannimi = req.query.kunta;
	var https = require('https');
	console.log("lati" + lati +"longi" +longi)
	var options = {
	  host: 'maps.googleapis.com',
	  path: '/maps/api/place/nearbysearch/json?location='+lati+',%20'+longi+'&type=cities&radius=50000&key=AIzaSyCkYwq88Z6EjbAUpeXxXbGEBYJyQHvVH7g'
	};
	
	var req = https.get(options, function(rs) {
	  //console.log('STATUS: ' + res.statusCode);
	  //console.log('HEADERS: ' + JSON.stringify(res.headers));

	  // Buffer the body entirely for processing as a whole.
	  var bodyChunks = [];
	  rs.on('data', function(chunk) {
		// You can process streamed parts here...
		bodyChunks.push(chunk);
		
	  }).on('end', function() {
		var body = Buffer.concat(bodyChunks);
		//console.log('BODY: ' + body);
		var bodyJSON = JSON.parse(body);
		var city = bodyJSON.results[0].name;
		//console.log(city);
		res.redirect('/weather?city='+city+'&kunta='+kunnannimi);
		res.end();
		return;
		
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
			var bodyJSON = JSON.parse(body);
			var lati = bodyJSON.results[0].geometry.location.lat;
			var longi = bodyJSON.results[0].geometry.location.lng;
			console.log("osote haettu");
			res.redirect('/kunta?lat='+lati+'&longi='+longi);
			res.end();
			return;
			
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
	res.redirect("/kunta?lat="+lat+"&longi="+lng);
	res.end();
	return;
	
};

function getNearestLakes(req,res) {
	var city = req.query.city;
	var temperature = req.query.temp;
	var kunnannimi = req.query.kunta;
	querystring = "http://rajapinnat.ymparisto.fi/api/jarvirajapinta/1.0/odata/Jarvi?$top=10&$filter=substringof('"+kunnannimi+"',%20KuntaNimi)%20eq%20true&$select=KoordErLat,KoordErLong,Nimi";
	var options = {
	  host: 'http://rajapinnat.ymparisto.fi',
	  path: querystring
	};
	var req = http.get(querystring, function(rs) {
	  //console.log('STATUS: ' + res.statusCode);
	  //console.log('HEADERS: ' + JSON.stringify(res.headers));

	  // Buffer the body entirely for processing as a whole.
	  var bodyChunks = [];
	  rs.on('data', function(chunk) {
		// You can process streamed parts here...
		bodyChunks.push(chunk);
		
	  }).on('end', function() {
		var body = Buffer.concat(bodyChunks);
		//console.log('BODY: ' + body);
		var bodyJSON = JSON.parse(body);
		values = [];
		for (i=0;i<10;i++) {
			bufferString = bodyJSON.value[i].Nimi + " ," + bodyJSON.value[i].KoordErLat + "," + bodyJSON.value[i].KoordErLong;
			values.push(bufferString);
		}
		console.log(values);
		res.render('result.ejs', {temp: temperature, city: city, info0: values[0],info1: values[1], info2: values[2],
			info3: values[3],info4: values[4],info5: values[5],info6: values[6],info7: values[7],info8: values[8],
			info9: values[9],kunta: kunnannimi});
		res.end();
		
	  })
	});
	req.on('error', function(e) {
	 console.log('ERROR: ' + e.message);
	});
		
	
	req.end();
}
function getNearestKunta(req, res) {
	var lat = req.query.lat;
	var long = req.query.longi;
	querystring = 'http://api.geonames.org/findNearbyPlaceNameJSON?lat='+lat+'&lng='+long+'&cities=cities1000&username=demo';
	var req = http.get(querystring, function(rs) {
	  //console.log('STATUS: ' + res.statusCode);
	  //console.log('HEADERS: ' + JSON.stringify(res.headers));

	  // Buffer the body entirely for processing as a whole.
	  var bodyChunks = [];
	  rs.on('data', function(chunk) {
		// You can process streamed parts here...
		bodyChunks.push(chunk);
		
	  }).on('end', function() {
		var body = Buffer.concat(bodyChunks);
		//console.log('BODY: ' + body);
		var bodyJSON = JSON.parse(body);
		console.log(bodyJSON);
		var kunnannimi = bodyJSON.geonames[0].name;
		console.log(kunnannimi);
		res.redirect("/nearestcity?lati="+lat+"&longi="+long+"&kunta="+kunnannimi);
		res.end();
		return;
		
	  })
	});
	req.on('error', function(e) {
	 console.log('ERROR: ' + e.message);
	});

	req.end();
}
