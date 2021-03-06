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

router.get("/api/1", client_coords);
router.get("/api/2", client_kunta);
router.get("/api/3", client_kaupunki);
router.get("/api/4", client_saa);
router.get("/api/5", client_jarvet);

var port = process.env.PORT || 8080;
app.listen(port,function(){
  console.log("Live at Port "+ port);
});

//käytä näin
//http://localhost:3000/weather?city=tampere
function getWeather(req,res,next){
	//Calls 10min: 600 
	//Calls 1day: 50,000 
	//Threshold: 7,200 
	//Hourly forecast: 5 
	var origcoords = req.query.origcoords;
	var key = "1cc4e57135b51120a49c601ab2c82ed8";
	var cityName = req.query.city;
	var kunta = req.query.kunta;
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
		if (bodyJSON.main == undefined) {
			res.write("Something went wrong");
			res.end();
		}
		else {
			var bodyJSON = JSON.parse(body);
			var celcius = Math.round(bodyJSON.main.temp - 273.15);
			var temperature = celcius + " C";
			res.write(temperature);
			res.end();
		}
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
	var key="AIzaSyCkYwq88Z6EjbAUpeXxXbGEBYJyQHvVH7g"
	var lati = req.query.lati;
	var longi = req.query.longi;
	var https = require('https');
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
			if (bodyJSON.results[0] == undefined) {
				var answer = "Something went wrong";
			} else {
				var lati = bodyJSON.results[0].geometry.location.lat;
				var longi = bodyJSON.results[0].geometry.location.lng;
				var answer = lati+","+longi;
			}
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
		res.write(body);
		res.end();
		return;
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

function client_coords(req,res) {
	var http = require("http");
	var address = req.query.address;
	var lati = req.query.lat;
	var longi = req.query.lng;
	if (address != undefined || typeof(address) != "undefined") {
		var req = http.get("http://localhost:8080/api/coordinates?address="+address, function(rs) {
			var bodyChunks = [];
			  rs.on('data', function(chunk) {
				// You can process streamed parts here...
				bodyChunks.push(chunk);
				
			  }).on('end', function() {
				var body = Buffer.concat(bodyChunks);
				var bodyJSON = body.toString();
				if ( bodyJSON == "Something went wrong") {
					res.render('error.ejs');
				} else {
					lati = bodyJSON.split(",")[0];
					longi = bodyJSON.split(",")[1];
					res.redirect('/api/2?lat='+lati+'&lng='+longi);
				}
			  })			
	}).end();
	}
	else {
		res.redirect('/api/2?lat='+lati+'&lng='+longi);
	}
}
function client_kunta(req, res) {
	var lati = req.query.lat;
	var longi = req.query.lng;
	var req = http.get("http://localhost:8080/api/kunta?lat="+lati+'&longi='+longi, function(rs) {
		var bodyChunks = [];
		rs.on('data', function(chunk) {
		// You can process streamed parts here...
		bodyChunks.push(chunk);
		}).on('end', function() {
			var body = Buffer.concat(bodyChunks);
			var bodyJSON = body.toString();
			res.redirect('/api/3?kunta='+bodyJSON+"&lat="+lati+'&longi='+longi);
		  })		
		}).end();
}
function client_kaupunki(req, res) {
	var lati = req.query.lat;
	var longi = req.query.longi;
	var kunta = req.query.kunta;
	var req = http.get("http://localhost:8080/api/nearestcity?lati="+lati+'&longi='+longi, function(rs) {
		var bodyChunks = [];
		rs.on('data', function(chunk) {
		// You can process streamed parts here...
		bodyChunks.push(chunk);
			
		}).on('end', function() {
			var body = Buffer.concat(bodyChunks);
			var bodyJSON = body.toString();
			var origcoords = lati+","+longi;
			res.redirect('/api/4?kunta='+kunta+"&origcoords="+origcoords+'&city='+bodyJSON);
		  })		
		}).end();
}
function client_saa(req, res) {
	var orgcrd = req.query.origcoords;
	var city = req.query.city;
	var kunta = req.query.kunta;
	var req = http.get("http://localhost:8080/api/weather?city="+city, function(rs) {
		var bodyChunks = [];
		rs.on('data', function(chunk) {
		// You can process streamed parts here...
		bodyChunks.push(chunk);
			
		}).on('end', function() {
			var body = Buffer.concat(bodyChunks);
			var bodyJSON = body.toString();
			if (bodyJSON == "Something went wrong") {
				res.render('error.ejs');
			} else {
			res.redirect('/api/5?kunta='+kunta+"&origcoords="+orgcrd+'&city='+city+'&weather='+bodyJSON);
			}
		  })		
		}).end();
}
function client_jarvet(req, res) {
	var orgcrd = req.query.origcoords;
	var city = req.query.city;
	var kunta = req.query.kunta;
	var saa = req.query.weather;
	var req = http.get("http://localhost:8080/api/lakes?kunta="+kunta, function(rs) {
		var bodyChunks = [];
		if (res.statusCode != 200) {
			res.render('error.ejs');
		}
		rs.on('data', function(chunk) {
		// You can process streamed parts here...
		bodyChunks.push(chunk);
			
		}).on('end', function() {
			var body = Buffer.concat(bodyChunks);
			var bodyJSON = JSON.parse(body);
			lakes = [];
			var length = Object.keys(bodyJSON.value).length;
			if (bodyJSON.value[0] == undefined) {
				res.render('error.ejs');
			} else {	
				for (i=0;i<length;i++) {
					bufferString = bodyJSON.value[i].Nimi + " ," + bodyJSON.value[i].KoordErLat + "," + bodyJSON.value[i].KoordErLong;
					lakes.push(bufferString);
				}	
				res.render('result.ejs', {temp: saa, city: city, info0: lakes[0],info1: lakes[1], info2: lakes[2],
				info3: lakes[3],info4: lakes[4],info5: lakes[5],info6: lakes[6],info7: lakes[7],info8: lakes[8],
				info9: lakes[9],kunta: kunta, origcoords: orgcrd});	
			}
		  })		
		}).end();
}

