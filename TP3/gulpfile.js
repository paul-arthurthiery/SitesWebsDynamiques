'use strict';

var gulp = require('gulp');
var connect = require("gulp-connect");

/**
 * Web Server Task
 * --------------
 * Starts a web server to host the files.
 */
gulp.task('web-server', function() {
  connect.server({
    port: 8000,
    middleware: function() {
      return [
        function(req, res, next){
          req.method = 'GET';
          return next();
        }
      ];
    }
  });
});

/**
 * Default Task
 * ------------
 * Starts the webserver.
 */
gulp.task('default', ['web-server']);
