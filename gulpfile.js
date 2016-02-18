// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var image = require('gulp-image');
var minifyCss = require('gulp-minify-css');
var imageop = require('gulp-image-optimization');
var minifyHTML = require('gulp-minify-html');
var connect = require('gulp-connect');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var merge = require('merge-stream');

// Minify index.html
gulp.task('html-index', function() {
    var opts = {
        conditionals: true,
        spare:true
    };

    return gulp.src('public/dev/index.html')
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

// Minify widgets folder
gulp.task('html-widgets', function() {
    var opts = {
        conditionals: true,
        spare:true
    };

    return gulp.src('public/dev/widgets/*.html')
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest('public/build/widgets'));
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
    var js = gulp.src('public/dev/js/*.js')
        .pipe(gulp.dest('public/build/js'));

    var index = gulp.src('public/dev/index.js')
        .pipe(gulp.dest('public/build/js'));

    return merge(index, js);
});

// Concatenate final bundle
gulp.task('package', function() {
    return gulp.src(['public/build/js/index.js', 'public/build/js/app.js', 'public/build/js/appController.js',
        'public/build/js/appDirective.js', 'public/build/js/appFactory.js'])
        .pipe(concat('main.js'))
        .pipe(gulp.dest('public/build'));
});

// Browserify js files
gulp.task('browserify', function() {
    // Grabs the app.js file
    return browserify('public/build/main.js')
        // bundles it and creates a file called main.js
        .bundle()
        .pipe(source('bundle.js'))
        // saves it the public/js/ directory
        .pipe(gulp.dest('public/build/'));
});

// Make localhost
gulp.task('connect', function () {
    connect.server({
        root: 'public/build/',
        port: 3000
    })
});

// Default Task
gulp.task('default', ['html-index', 'html-pages', 'html-widgets', 'css', 'image', 'lint', 'jshint', 'scripts']);