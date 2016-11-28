'use strict';

exports.lakesGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * size (Double)
  * lat (Double)
  * long (Double)
  **/
  
 
  
  var http = require('http');
  var request = require('request');
  var Body;
  
  
  
  
  var path ='https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=61.448456,%2023.854756&type=natural_feature&radius=50000&key=AIzaSyCkYwq88Z6EjbAUpeXxXbGEBYJyQHvVH7g';

	
	request(path, function (error, response, body) {
  if (!error && response.statusCode == 200) {
	  //res.write(body, function (){res.end();});
	  
		console.log(body) // Show the HTML for the Google homepage. 
  }else{
	//res.write("kurahti", function(){res.end();});
	  
  }
})	
  
  //res.writeHead(200, {'Content-Type': 'text/plain'});
  //res.end(args.size + args.lat +args.long);
  
}

exports.weatherGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  **/
  // no response value expected for this operation
  res.end();
}

