var gulp = require('gulp');
var watch = require('gulp-watch');
var del = require('del');
var jshint = require('gulp-jshint');
var karma = require('karma').Server;
var minify = require('gulp-minify');
var shell = require('gulp-shell');

gulp.task('clean', function() {
  return del(['dist/', 'docs/']);
});

gulp.task('lint-src', function() {
  return gulp.src('src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('lint-tests', function() {
  return gulp.src('tests/spec/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('test', function (done) {
  new karma({
    configFile: __dirname + '/karma.conf.js',
  }, done).start();
});

gulp.task('compress', function() {
  gulp.src('src/*.js')
    .pipe(minify({
        ext:{
        	src:'.debug.js',
            min:'.min.js'
        },
        exclude: ['tasks'],
        ignoreFiles: ['.combo.js', '-min.js']
    }))
    .pipe(gulp.dest('dist'))
});

// Unfortunately, no real gulp package exists for jsdoc.
gulp.task('doc', shell.task([
	'jsdoc -c jsdoc.conf.json'
]));

gulp.watch(['*.js', 'src/*.js', 'jsdoc.conf.json', 'README.md'], ['lint-src', 'lint-tests', 'compress', 'doc']);

gulp.task('default', ['clean'], function() {
  gulp.start('lint-src', 'lint-tests', 'test', 'compress', 'doc');
});