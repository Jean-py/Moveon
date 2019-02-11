'use strict';

var express = require('express');
var router = express.Router();
var config = require('../config/configServer');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('sensors', { title: config.appName, subtitle: 'Bienvenue' });
});

module.exports = router;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3RGaWxlLmpzIl0sIm5hbWVzIjpbImV4cHJlc3MiLCJyZXF1aXJlIiwicm91dGVyIiwiUm91dGVyIiwiY29uZmlnIiwiZ2V0IiwicmVxIiwicmVzIiwibmV4dCIsInJlbmRlciIsInRpdGxlIiwiYXBwTmFtZSIsInN1YnRpdGxlIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxVQUFVQyxRQUFRLFNBQVIsQ0FBZDtBQUNBLElBQUlDLFNBQVNGLFFBQVFHLE1BQVIsRUFBYjtBQUNBLElBQUlDLFNBQVNILFFBQVEsd0JBQVIsQ0FBYjs7QUFHQTtBQUNBQyxPQUFPRyxHQUFQLENBQVcsR0FBWCxFQUFnQixVQUFTQyxHQUFULEVBQWNDLEdBQWQsRUFBbUJDLElBQW5CLEVBQXlCO0FBQ3ZDRCxNQUFJRSxNQUFKLENBQVcsU0FBWCxFQUFzQixFQUFFQyxPQUFPTixPQUFPTyxPQUFoQixFQUF5QkMsVUFBVSxXQUFuQyxFQUF0QjtBQUNELENBRkQ7O0FBS0FDLE9BQU9DLE9BQVAsR0FBaUJaLE1BQWpCIiwiZmlsZSI6InRlc3RGaWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJyk7XG5sZXQgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcbmxldCBjb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcvY29uZmlnU2VydmVyJyk7XG5cblxuLyogR0VUIGhvbWUgcGFnZS4gKi9cbnJvdXRlci5nZXQoJy8nLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICByZXMucmVuZGVyKCdzZW5zb3JzJywgeyB0aXRsZTogY29uZmlnLmFwcE5hbWUsIHN1YnRpdGxlOiAnQmllbnZlbnVlJ30pO1xufSk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSByb3V0ZXI7XG4iXX0=