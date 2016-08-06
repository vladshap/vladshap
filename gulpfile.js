var gulp = require('gulp');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var browserSync = require('browser-sync');
var scsslint = require('gulp-scss-lint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');


gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('styles', function () {
    gulp.src(['scss/**/*.scss'])
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(sass())
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest('assets/styles/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('assets/styles/'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('scss-lint', function () {
    return gulp.src('scss/**/*.scss')
        .pipe(scsslint({
            'config': 'default.yml'
        }));
});

gulp.task('js', function(){
    return gulp.src(
            [
                'scripts/jquery.js',
                'scripts/TweenMax.js',
                'scripts/ScrollMagic.js',
                'scripts/animation.gsap.js',
                //'scripts/debug.addindicators.js',
                'scripts/slick.js',
                'scripts/jquery.waitforimages.js',
                'scripts/site.js'
            ])
        .pipe(sourcemaps.init())
        .pipe(concat('concat.js'))
        .pipe(gulp.dest('assets/js'))
        .pipe(rename('site.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('assets/js'))
        .pipe(browserSync.reload({stream: true}));
});


gulp.task('default', ['browser-sync'], function () {
    gulp.watch("scss/**/*.scss", ['styles']);
    gulp.watch("*.html", ['bs-reload']);
    gulp.watch("scripts/*.js", ['js']);
});