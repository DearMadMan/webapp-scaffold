var gulp = require('gulp');
var liveServer = require('gulp-live-server');
var concat = require('gulp-concat');
var autoPrefixer = require('gulp-autoprefixer');
var jade = require('gulp-jade');
var minifyCss = require('gulp-minify-css');
var minifyHtml = require('gulp-minify-html');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var plumber = require('gulp-plumber');
var extreplace = require('gulp-ext-replace');
var babel = require('gulp-babel');
var usermin = require('gulp-usemin');
var rev = require('gulp-rev');



gulp.task('html', function() {
    console.log('moving html start...');
    gulp.src('app/*.html')
        .pipe(usemin({
            css: [rev()],
            html: [minifyHtml({
                empty: true
            })],
            js: [uglify(), rev()],
            inlinejs: [uglify()],
            inlinecss: [minifyCss(), 'concat']
        }))
        .pipe(gulp.dest('dist'));
    console.log('moving html end...');
});

gulp.task('asset', function() {
    console.log('moving assets start...');
    gulp.src('app/asset/**')
        .pipe(gulp.dest('dist/asset'));
    console.log('moving assets stop...');
});

gulp.task('js', function() {
    console.log('moving js start...');
    gulp.src('app/js/**/*.js')
        .pipe(plumber())
        .pipe(babel())
        .pipe(uglify())
        .pipe(plumber.stop())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('sass', function() {
    console.log('moving css start...');
    gulp.src('app/sass/**/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(extreplace('.css'))
        .pipe(autoPrefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(minifyCss())
        .pipe(plumber.stop())
        .pipe(gulp.dest('dist/css'))
    console.log('moving css end....');
});


gulp.task('server', function() {
    var server = liveServer.static('dist', 3000);
    server.start();
    gulp.watch('app/*.html', ['html']);
    gulp.watch('app/sass/**/*.scss', ['sass']);
    gulp.watch('app/js/**/*.js', ['js']);
    gulp.watch([
        'dist/**/**'
    ], function(file) {
        console.log('change:');
        console.log(file.path);
        server.notify.apply(server, [file]);
    });
});


gulp.task('clean', function() {
    console.log('clean start ...');
    gulp.src('dist/**/*', {
            read: false
        })
        .pipe(plumber())
        .pipe(clean());
})



gulp.task('default', ['server', 'html', 'js', 'sass', 'asset'], function() {
    console.log('default task running...');
});
