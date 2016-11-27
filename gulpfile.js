var gulp = require('gulp');
var clean = require('gulp-clean');
var jshint = require('gulp-jshint');
var filesize = require('gulp-filesize');
var minify = require('gulp-minify');
var jsdoc = require('gulp-jsdoc3');
var gutil = require('gulp-util');
var karma = require('karma').Server;

function karmaDone (err, done) {
    if (err > 0) {
        return done(new gutil.PluginError('karma', 'Karma tests failed.'));
    }
    return done();
}

gulp.task('clean', function () {
    return gulp.src([
        'arrgh.js',
        'arrgh.debug.js',
        'dist/',
        'docs/',
        'test/coverage/',
        'test/junit/',
        'test/junit.debug/'
    ], { read: false })
    .pipe(clean());
})
.task('build', ['clean'], function () {
    return gulp.src('src/*.js')
    .pipe(filesize())
    .pipe(jshint('jshint.conf.json'))
    .pipe(jshint.reporter('default'))
    .pipe(jsdoc(require('./jsdoc.conf.json')))
    .pipe(minify({
        ext: {
            src: '.debug.js',
            min: '.js'
        },
        preserveComments: 'some'
    }))
    .pipe(filesize())
    .pipe(gulp.dest('dist'));
})
.task('lint-tests', function () {
	return gulp.src('test/spec/*.js')
    .pipe(jshint('jshint.tests.conf.json'))
    .pipe(jshint.reporter('default'))
})
.task('test', ['lint-tests'], function (done) {
    new karma({
        configFile: __dirname + '/karma.conf.js',
    }, err => karmaDone(err, done)).start();
})
.task('test-min', ['build', 'test'], function (done) {
    new karma({
        configFile: __dirname + '/karma.conf.min.js',
    }, err => karmaDone(err, done)).start();
});

gulp.task('default', function () {
    gulp.start('test-min');
});