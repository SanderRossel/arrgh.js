var gulp = require('gulp');
var watch = require('gulp-watch');
var del = require('del');
var jshint = require('gulp-jshint');
var minify = require('gulp-minify');
var shell = require('gulp-shell');

gulp.task('clean', function() {
    return del(['dist/', 'docs/']);
});

gulp.task('lint', function() {
  return gulp.src('src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
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
	'jsdoc src/arrgh.js -d docs'
]));

gulp.watch('src/*.js', ['lint, compress, doc']);

gulp.task('default', ['clean'], function() {
  gulp.start('lint', 'compress', 'doc');
});