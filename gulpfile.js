var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('default', defaultTask)
gulp.task('styles', function () {
    gulp.src('sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest('./css'));
});

//创建浏览器同步对象并初始化服务器
function defaultTask(done) {
    var browserSync = require('browser-sync').create();
    browserSync.init({
        //这里的意思是含有这个文件的目录地址，可以将目录更改
        server: "./"
    });
    browserSync.stream();
    done();
}
