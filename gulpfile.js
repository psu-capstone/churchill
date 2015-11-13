// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var image = require('gulp-image');
var minifyCss = require('gulp-minify-css');

// Image Task
gulp.task('image', function () {
    gulp.src('public/dev/images/*')
        .pipe(image())
        .pipe(gulp.dest('public/build/images'));
});

// CSS Task
gulp.task('css', function() {
    return gulp.src('public/dev/stylesheets/*.css')
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest('public/build/stylesheets'));
});

// Lint Task
gulp.task('lint', function() {
    return gulp.src('public/dev/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// JS hint task
gulp.task('jshint', function() {
    gulp.src('public/dev/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concatenate JS
gulp.task('scripts', function() {
    return gulp.src('public/dev/js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('public/build/js'))
});

// Default Task
gulp.task('default', ['image', 'css', 'lint', 'jshint', 'scripts']);