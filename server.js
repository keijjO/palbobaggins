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

router.get("/api/", client);
router.get("/",function(req,res){
  res.render(path + "weather.ejs");
});

router.get("/api/karttasivu",function(req,res){
	res.sendFile(path + "karttasivu.html")
});
app.use("/",router);

router.get('/api/weather/', getWeather);

router.get('/api/nearestcity/', getNearestCity);
router.get('/api/coordinates', getCoordinates);
router.get('/api/weatherInCoords', getWeatherInCoords);
router.get('/api/lakes',getNearestLakes);
router.get('/api/kunta', getNearestKunta);


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
	var origcoords = req.query.origcoords;
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
		res.write(temperature);
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
		res.write(city);
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
			var answer = lati+","+longi;
			res.write(answer);
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
		res.write(JSON.parse(body));
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
		var bodyJSON = JSON.parse(body);
		console.log(bodyJSON);
		var kunnannimi = bodyJSON.geonames[0].name;
		res.write(kunnannimi);
		res.end();
		return;
		
	  })
	});
	req.on('error', function(e) {
	 console.log('ERROR: ' + e.message);
	});

	req.end();
}

function client(req,res) {
	var http = require("http");
	var address = req.query.address;
	var lati = req.query.lat;
	var longi = req.query.lng;
	if (address != "" || typeof(address) != "undefined") {
		var req = http.get("http://localhost:8080/api/coordinates?address="+address, function(rs) {
			var bodyChunks = [];
			  rs.on('data', function(chunk) {
				// You can process streamed parts here...
				bodyChunks.push(chunk);
				
			  }).on('end', function() {
				var body = Buffer.concat(bodyChunks);
				//console.log('BODY: ' + body);
				var bodyJSON = body.toString();
				console.log("jee:"+bodyJSON);
				lati = bodyJSON.split(",")[0];
				console.log(lati);
				longi = bodyJSON.split(",")[1];
				res.end();
			  })			
		});
		req.end();
	}
	var origcoords = lati+","+longi;
	console.log("jee2:"+origcoords);
	// Haetaan kunta
	var kunta;
	var kuntareq = http.get("http://localhost:8080/api/kunta?lat="+lati+'&longi='+longi, function(rs) {
		var bodyChunks = [];
		rs.on('data', function(chunk) {
		// You can process streamed parts here...
		bodyChunks.push(chunk);

		}).on('end', function() {
		var body = Buffer.concat(bodyChunks);
		var bodyJSON = body;
		kunta = bodyJSON;
		res.end();
		})
	});
	kuntareq.end();
	var city;
	cityreq = http.get("http://localhost:8080/api/city?lat="+lati+'&longi='+longi, function(rs) {
		var bodyChunks = [];
		rs.on('data', function(chunk) {
		// You can process streamed parts here...
		bodyChunks.push(chunk);

		}).on('end', function() {
		var body = Buffer.concat(bodyChunks);
		//console.log('BODY: ' + body);
		var bodyJSON = body;
		city = bodyJSON;
		res.end();
		})
	});
	cityreq.end();
	var weather;
	wreq = http.get("http://localhost:8080/api/weather?city="+city, function(rs) {
		var bodyChunks = [];
		rs.on('data', function(chunk) {
		// You can process streamed parts here...
		bodyChunks.push(chunk);

		}).on('end', function() {
		var body = Buffer.concat(bodyChunks);
		//console.log('BODY: ' + body);
		var bodyJSON = body;
		weather = bodyJSON;
		res.end();
		return;
		})
	});
	wreq.end();
	var lakes = [];
	lakesreq = http.get("http://localhost:8080/api/lakes?kunta="+kunta, function(rs) {
		var bodyChunks = [];
		rs.on('data', function(chunk) {
		// You can process streamed parts here...
		bodyChunks.push(chunk);

		}).on('end', function() {
		var body = Buffer.concat(bodyChunks);
		//console.log('BODY: ' + body);
		var bodyJSON = JSON.parse(body);
		for (i=0;i<10;i++) {
			bufferString = bodyJSON.value[i].Nimi + " ," + bodyJSON.value[i].KoordErLat + "," + bodyJSON.value[i].KoordErLong;
			lakes.push(bufferString);
		}	
		lakes = bodyJSON;
		res.end();
		return;
		})
	});
	lakesreq.end();
	res.render('result.ejs', {temp: weather, city: city, info0: lakes[0],info1: lakes[1], info2: lakes[2],
		info3: lakes[3],info4: lakes[4],info5: lakes[5],info6: lakes[6],info7: lakes[7],info8: lakes[8],
		info9: lakes[9],kunta: kunta, origcoords: origcoords});
}