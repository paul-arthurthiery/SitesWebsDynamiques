'use strict';

var CONST = {
  CSS_FOLDER: './assets/css/'
};

var connect = require("gulp-connect");
var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var recess = require('gulp-recess');


/**
 * Check CSS Task
 * --------------
 * Checks the CSS file.
 */
gulp.task('check-css', function () {
  return gulp.src(CONST.CSS_FOLDER + '*.less')
    .pipe(recess({
      noIDs: false,
      noOverqualifying: false
    }))
    .pipe(recess.reporter())
});

/**
 * Build CSS Task
 * --------------
 * Compiles a LESS file to a CSS minified file.
 */
gulp.task('build-css', function () {
  return gulp.src(CONST.CSS_FOLDER + '*.less')
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(gulp.dest(CONST.CSS_FOLDER));
});

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
 * Starts the webserver and creates watchers to watch file changes.
 */
gulp.task('default', ['web-server'], function () {
  function log(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  }

  var cssWatcher = gulp.watch(CONST.CSS_FOLDER + '*.less', ['check-css', 'build-css']);
  cssWatcher.on('change', log);
});
