// 引入 gulp
var gulp = require('gulp');

// 引入组件
var minifyCSS = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel')
    ;

// 合并，压缩 js 文件
gulp.task('popup-js', function() {
    return gulp.src([
            './src/js/libs/*.js',
            './src/js/model.js',
            './src/js/table.js',
            './src/js/popup.js'
            ])
        .pipe(concat('popup.min.js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify({
            mangle: false
        }).on('error', function (e) {
            console.log(e)
        }))
        .pipe(gulp.dest('./static/'))
});
gulp.task('option-js', function() {
    return gulp.src([
            './src/js/libs/*.js',
            './src/js/model.js',
            './src/js/table.js',
            './src/js/option.js'
            ])
        .pipe(concat('option.min.js'))
        // .pipe(uglify({
        //     mangle: false
        // }).on('error', function (e) {
        //     console.log(e)
        // }))
        .pipe(gulp.dest('./static/'))
});
gulp.task('script-js', function() {
    return gulp.src([
            './src/js/script.js'
            ])
        .pipe(concat('script.min.js'))
        .pipe(uglify({
            mangle: false
        }))
        .pipe(gulp.dest('./static/'))
});
gulp.task('background-js', function() {
    return gulp.src([
            './src/js/background.js'
            ])
        .pipe(concat('background.min.js'))    // 合并
        .pipe(uglify({
            mangle: false
        }))
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
        'popup-js',
        'option-js',
        'script-js',
        'background-js'
        ]);
    gulp.watch('./src/css/*.css', ['css']);
});