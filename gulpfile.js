var del = require('del');
var gulp = require('gulp');
var emailBuilder = require('./lib/emailBuilder');
var connect = require('gulp-connect');


/* *************
	CLEAN
************* */

gulp.task('clean', function (cb) {
  return del([
    './src/dist',
    './reports'
  ], cb);
});


/* *************
	SERVER
************* */

gulp.task('connect', function() {
  connect.server({
    port: 8000,
    root: './src', // Serve from build directory instead,
    livereload:true
  });
});


/* *************
	BUILD
************* */

gulp.task('build', function() {
  return gulp.src(['./src/html/*.html'])
    .pipe(emailBuilder().build())
    .pipe(gulp.dest('./src/dist/'))
    .pipe(connect.reload());
});


/* *************
    WATCH
************* */

var filesToWatch = [
  'src/html/*.html',
  'src/css/*.css'
]

gulp.task('watch', function() {
  gulp.watch(filesToWatch,['build']);
});



/* *************
    DEFAULT
************* */

gulp.task('default', ['connect', 'build', 'watch']);
