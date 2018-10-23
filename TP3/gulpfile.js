

const gulp = require('gulp');
const connect = require('gulp-connect');

/**
 * Web Server Task
 * --------------
 * Starts a web server to host the files.
 */
gulp.task('web-server', () => {
  connect.server({
    port: 8000,
    middleware() {
      return [
        (req, res, next) => {
          req.method = 'GET';
          return next();
        },
      ];
    },
  });
});

/**
 * Default Task
 * ------------
 * Starts the webserver.
 */
gulp.task('default', ['web-server']);
