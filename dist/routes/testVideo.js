'use strict';

var express = require('express');
var router = express.Router();
var config = require('../config/default');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('testVideo', { title: config.appName, subtitle: 'Touch the screen to continue...' });
});

module.exports = router;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3RWaWRlby5qcyJdLCJuYW1lcyI6WyJleHByZXNzIiwicmVxdWlyZSIsInJvdXRlciIsIlJvdXRlciIsImNvbmZpZyIsImdldCIsInJlcSIsInJlcyIsIm5leHQiLCJyZW5kZXIiLCJ0aXRsZSIsImFwcE5hbWUiLCJzdWJ0aXRsZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsVUFBVUMsUUFBUSxTQUFSLENBQWQ7QUFDQSxJQUFJQyxTQUFTRixRQUFRRyxNQUFSLEVBQWI7QUFDQSxJQUFJQyxTQUFTSCxRQUFRLG1CQUFSLENBQWI7O0FBRUE7QUFDQUMsT0FBT0csR0FBUCxDQUFXLEdBQVgsRUFBZ0IsVUFBU0MsR0FBVCxFQUFjQyxHQUFkLEVBQW1CQyxJQUFuQixFQUF5QjtBQUN2Q0QsTUFBSUUsTUFBSixDQUFXLFdBQVgsRUFBd0IsRUFBRUMsT0FBT04sT0FBT08sT0FBaEIsRUFBeUJDLFVBQVUsaUNBQW5DLEVBQXhCO0FBQ0QsQ0FGRDs7QUFJQUMsT0FBT0MsT0FBUCxHQUFpQlosTUFBakIiLCJmaWxlIjoidGVzdFZpZGVvLmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJyk7XG5sZXQgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcbmxldCBjb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcvZGVmYXVsdCcpO1xuXG4vKiBHRVQgaG9tZSBwYWdlLiAqL1xucm91dGVyLmdldCgnLycsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHJlcy5yZW5kZXIoJ3Rlc3RWaWRlbycsIHsgdGl0bGU6IGNvbmZpZy5hcHBOYW1lLCBzdWJ0aXRsZTogJ1RvdWNoIHRoZSBzY3JlZW4gdG8gY29udGludWUuLi4nfSk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSByb3V0ZXI7XG4iXX0=