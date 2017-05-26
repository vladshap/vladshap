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
var gzip = require("gulp-gzip");
var cp = require('child_process');
// var awspublish = require('gulp-awspublish');

var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> jekyll build'
};

gulp.task('browser-sync', function () {
    browserSync({
        notify: false,
        server: {
            baseDir: "_site"
        }
    });
});

// gulp.task('bs-reload', function () {
//     browserSync.reload();
// });

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
        .pipe(gulp.dest('_site/assets/styles/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('_site/assets/styles/'))
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
                'bower_components/jquery/dist/jquery.js',
                'bower_components/gsap/src/uncompressed/TweenMax.js',
                'bower_components/scrollmagic/scrollmagic/uncompressed/ScrollMagic.js',
                'bower_components/scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js',
                // 'bower_components/scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js',
                // 'bower_components/slick-carousel/slick/slick.js',
                // 'bower_components/waitForImages/src/jquery.waitforimages.js',
                'bower_components/instafeed.js/instafeed.js',
                'bower_components/photoswipe/dist/photoswipe.js',
                'bower_components/photoswipe/dist/photoswipe-ui-default.js',
                'bower_components/justifiedGallery/dist/js/jquery.justifiedGallery.js',
                // 'bower_components/history.js/scripts/uncompressed/history.js',
                'bower_components/history.js/scripts/bundled/html5/jquery.history.js',
                'scripts/site.js'
            ])
        .pipe(sourcemaps.init())
        // .pipe(concat('concat.js'))
        // .pipe(gulp.dest('assets/js'))
        // .pipe(rename('site.min.js'))
        .pipe(concat('site.min.js'))
        .pipe(gulp.dest('_site/assets/js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('_site/assets/js'))
        .pipe(browserSync.reload({stream: true}));
});


gulp.task('jekyll-build', function (done) {
    // browserSync.notify(messages.jekyllBuild);
    return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
        .on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll-build', 'styles', 'js'], function () {
    browserSync.reload();
});

// gulp.task('s3-publish', function() {
//     var publisher = awspublish.create({
//         region: 'us-west-2',
//         params: {
//             Bucket: 'vladshap'
//         }
//     });
//
//     var headers = {
//         'Cache-Control': 'max-age=315360000, no-transform, public'
//     };
//
//     var options = {
//     };
//
//     return gulp.src('assets/**')
//         .pipe(awspublish.gzip())
//         .pipe(publisher.publish(headers, options))
//         .pipe(publisher.sync())
//         .pipe(publisher.cache())
//         .pipe(awspublish.reporter());
// });

gulp.task('watch', ['browser-sync'], function () {
    gulp.watch(['*.html', '_layouts/*.html', '_posts/*', '_photos/*', '_includes/*.html'], ['jekyll-rebuild']);
    gulp.watch("scss/**/*.scss", ['styles']);
    // gulp.watch("*.html", ['bs-reload']);
    gulp.watch("scripts/*.js", ['js']);
});