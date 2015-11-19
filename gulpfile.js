// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var image = require('gulp-image');
var minifyCss = require('gulp-minify-css');
var imageop = require('gulp-image-optimization');
var minifyHTML = require('gulp-minify-html');

// Minify index.html
gulp.task('html-index', function() {
    var opts = {
        conditionals: true,
        spare:true
    };

    return gulp.src('public/dev/*.html')
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest('public/build'));
});

// Minify pages folder
gulp.task('html-pages', function() {
    var opts = {
        conditionals: true,
        spare:true
    };

    return gulp.src('public/dev/pages/*.html')
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest('public/build/pages'));
});

// Image Task
gulp.task('image', function() {
    gulp.src(['public/dev/images/*.png','public/dev/images*.jpg','public/dev/images*.gif',
        'public/dev/images/*.jpeg']).pipe(imageop({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })).pipe(gulp.dest('public/build/images'));
});

// CSS Task
gulp.task('css', function() {
    return gulp.src('public/dev/stylesheets/*.css')
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest('public/build/stylesheets'));
});

// Lint Task
gulp.task('lint', function() {
    return gulp.src('public/dev/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// JS hint task
gulp.task('jshint', function() {
    gulp.src('public/dev/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concatenate JS
gulp.task('scripts', function() {
    return gulp.src('public/dev/*.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest('public/build'))
});

// Default Task
gulp.task('default', ['html-index', 'html-pages', 'css', 'image', 'lint', 'jshint', 'scripts']);