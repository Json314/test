var gulp = require('gulp');
var sass = require('gulp-sass');              // scss预编译
var sourcemaps = require('gulp-sourcemaps');
var htmlmin = require('gulp-htmlmin');        // html压缩
var cleanCSS = require('gulp-clean-css');     // css压缩
var autoprefixer = require('gulp-autoprefixer'); // 自动添加CSS3浏览器前缀
var uglify = require('gulp-uglify');          // js压缩
var image = require('gulp-image');            // 图片压缩
var webserver = require('gulp-webserver');		// 本地服务器

var srcPath = {
	html	: './app',
  scss: './app/scss',
	css		: './app/css',
	js	: './app/js',
	img	: './app/img'
};
var destPath = {
	html	: './dist',
	css		: './dist/css',
	js	: './dist/js',
	img	: './dist/img'
};

// sass处理
gulp.task('scss', function(){
  return gulp.src(srcPath.scss + '/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'], // 主流浏览器的最新两个版本
      cascade: false // 是否美化属性值
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(srcPath.css))
});

// 监听
gulp.task('watch', ['scss'], function(){
  gulp.watch(srcPath.scss + '/**/*.scss', ['scss']);
});

// 本地服务器
gulp.task('webserver', function() {
	gulp.src(srcPath.html) // 服务器目录（.代表根目录）
	.pipe(webserver({ // 运行gulp-webserver
		livereload: true, // 启用LiveReload
		open: true // 服务器启动时自动打开网页
	}));
});


gulp.task('default',['webserver','watch']);

/** 生产环境  **/

// html压缩
gulp.task('htmlRelease', function(){
  return gulp.src(srcPath.html + '/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(destPath.html));
});

// css压缩
gulp.task('cssRelease', function(){
  return gulp.src(srcPath.css + '/**/*.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest(destPath.css));
});

// js压缩
gulp.task('jsRelease', function(){
  return gulp.src(srcPath.js + '/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest(destPath.js));
});

// 图片压缩
gulp.task('imgRelease', function(){
  return gulp.src(srcPath.img + '/*')
    .pipe(image())
    .pipe(gulp.dest(destPath.img));
});

// 打包压缩
gulp.task('production', function(){
  return gulp.start('htmlRelease', 'cssRelease', 'jsRelease', 'imgRelease')
});
