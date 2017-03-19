// 引入 gulp
var gulp = require('gulp');

// 引入组件
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');    // 合并
var rev = require('gulp-rev');    // 对文件名加MD5后缀
var revCollector = require('gulp-rev-collector');    // 路径替换

// 合并，压缩 js 文件
gulp.task('popup-js', function() {
    return gulp.src([
            './src/js/libs/*.js',
            './src/js/model.js',
            './src/js/popup.js'
            ])
        .pipe(concat('popup.min.js'))
        .pipe(gulp.dest('./static/'))
});
gulp.task('option-js', function() {
    return gulp.src([
            './src/js/libs/*.js',
            './src/js/popup.js',
            './src/js/model.js',
            './src/js/option.js'
            ])
        .pipe(concat('option.min.js'))
        .pipe(gulp.dest('./static/'))
});
gulp.task('script-js', function() {
    return gulp.src([
            './src/js/script.js'
            ])
        .pipe(concat('script.min.js'))
        .pipe(gulp.dest('./static/'))
});
gulp.task('background-js', function() {
    return gulp.src([
            './src/js/background.js'
            ])
        .pipe(concat('background.min.js'))    // 合并
        .pipe(gulp.dest('./static/'))    // 保存
});

// 合并，压缩 css 文件
gulp.task('css', function () {
    return gulp.src('./src/css/style.css')
        .pipe(concat('snail-hosts.min.css'))    // 合并
        .pipe(minifyCSS())    // 压缩
        .pipe(gulp.dest('./static/'))    // 保存
});

// 默认任务
gulp.task('default', [
    'option-js',
    'popup-js',
    'script-js',
    'background-js',
    'css'
], function () {
    gulp.watch('./src/js/*.js', [
        'option-js',
        'popup-js',
        'script-js',
        'background-js'
        ]);
    gulp.watch('./src/css/*.css', ['css']);
});