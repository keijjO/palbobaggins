'use strict';

var url = require('url');


var Default = require('./DefaultService');


module.exports.lakesGET = function lakesGET (req, res, next) {
  Default.lakesGET(req.swagger.params, res, next);
  
  http.get('http://nodejs.org/dist/index.json')
};

module.exports.weatherGET = function weatherGET (req, res, next) {
  Default.weatherGET(req.swagger.params, res, next);
};
