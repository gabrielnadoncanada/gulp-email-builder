var gulp = require('gulp');
var emailBuilder = require('./lib/emailBuilder');
var connect = require('gulp-connect');
var replaceInclude = require('gulp-replace-include');
var filesToWatch = [
    'src/html/*.html',
    'src/css/*.css',
    'src/data/global.json'
];
var configs = require('./src/data/global');
var File = require('vinyl');
var through2 = require('through2');
var path = require('path');


function generate_files() {
    'use strict';
    return through2.obj(function (file, enc, next) {
        var mydata = file.contents.toString('utf8');
        var base = path.join(file.path, '..');
        var self = this;
        configs.main.forEach(function(config, index){
            self.push(new File({
                base: base,
                path: path.join(base, index + '.html'),
                contents: new Buffer(mydata)
            }));
        });
        next();
    });
}

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
        .pipe(generate_files())
        .pipe(gulp.dest('./src/dist/'))
        .pipe(connect.reload());
});


gulp.task('watch', function () {
    gulp.watch(filesToWatch, ['build']);
});

gulp.task('default', ['connect', 'build', 'watch']);
