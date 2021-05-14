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
        var html_start = "<html><head><meta charset='UTF-8'></head><body><h1>Index des signatures</h1><ul>";
        var html_end = "</ul></body></head></html>";
        var html_content = "";

        configs.main.forEach(function (config, index) {
            html_content += "<li><a href='./" + index + ".html'>" + config.name + "</a></li>";
            let new_data = replaceTokens(config, mydata);
            self.push(new File({
                base: base,
                path: path.join(base, index + '.html'),
                contents: new Buffer(new_data)
            }));
        });
        this.push(new File({
            base: base,
            path: path.join(base, "index.html"),
            contents: new Buffer(html_start + html_content + html_end)
        }))
        next();
    });
}

function get(obj, desc) {
    var arr = desc.split(".");
    while (arr.length && (obj = obj[arr.shift()])) ;
    return obj;
}

function replaceTokens(config, HTML) {
    return HTML.split('{{').map(function (i) {
        var symbol = i.substring(0, i.indexOf('}}')).trim();
        return i.replace(symbol + '}}', get(config, symbol));
    }).join('');
}


gulp.task('connect', function () {
    connect.server({
        port: 8000,
        root: './',
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
