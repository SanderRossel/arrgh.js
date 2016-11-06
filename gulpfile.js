var gulp = require('gulp');
var clean = require('gulp-clean');
var jshint = require('gulp-jshint');
var filesize = require('gulp-filesize');
var minify = require('gulp-minify');
var jsdoc = require('gulp-jsdoc3');
var watch = require('gulp-watch');
var karma = require('karma').Server;

gulp.task('clean', function () {
    return gulp.src(['dist/', 'docs/'], { read: false })
        .pipe(clean());
});

gulp.task('build', function () {
    return gulp.src('src/*.js')
        .pipe(filesize())
        .pipe(jshint('jshint.conf.json'))
        .pipe(jshint.reporter('default'))
        .pipe(jsdoc(require('./jsdoc.conf.json')))
        .pipe(minify({
            ext: {
                src: '.debug.js',
                min: '.min.js'
            },
            preserveComments: 'some'
        }))
        .pipe(filesize())
        .pipe(gulp.dest('dist'));
});

gulp.task('test', function (done) {
    new karma({
        configFile: __dirname + '/karma.conf.js',
    }, done).start();
});

gulp.watch(['*.js', 'src/*.js', '*.conf.*', 'README.md'], ['build']);

gulp.task('default', ['clean'], function () {
    gulp.start('build', 'test');
});