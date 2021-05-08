const del = require('del'),
    gulp = require('gulp'),
    emailBuilder = require('./lib/emailBuilder'),
    connect = require('gulp-connect'),
    replaceInclude  = require('gulp-replace-include'),
    filesToWatch = [
        'src/html/*.html',
        'src/css/*.css',
        'src/data/*.json'
    ],
    config = require('./src/data/global.json');


gulp.task('clean', function (cb) {
    return del([
        './src/dist',
        './reports'
    ], cb);
});


gulp.task('connect', function () {
    connect.server({
        port: 8000,
        root: './src',
        livereload: true
    });
});

gulp.task('build', function () {
    return gulp.src(['./src/html/*.html'])

        .pipe(emailBuilder().build())
        .pipe(replaceInclude({
            global: config,
        }))
        .pipe(gulp.dest('./src/dist/'))
        .pipe(connect.reload());
});


gulp.task('watch', function () {
    gulp.watch(filesToWatch, ['build']);
});

gulp.task('default', ['connect', 'build', 'watch']);
