// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var image = require('gulp-image');

// JS hint task
gulp.task('jshint', function() {
    gulp.src('public/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Image Task
gulp.task('image', function () {
    gulp.src('public/images/*')
        .pipe(image())
        .pipe(gulp.dest('build'));
});

// Lint Task
gulp.task('lint', function() {
    return gulp.src('public/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('public/js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('build'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build'));
});

// Default Task
gulp.task('default', ['lint', 'scripts', 'image']);