'use strict';

var  gulp = require( 'gulp' );
var merge = require('merge-stream');
var  gulpLoadplugin =require( 'gulp-load-plugins');
var minifycss = require('gulp-minify-css');//css压缩
var $ = gulpLoadplugin();


gulp.task("components-style",() => {
  var AUTOPREFIXER_BROWSERS = [
    'chrome >= 40',
    'ie >= 10',
    'ff >= 30',
    'safari >= 7',
    'opera >= 23'
  ];

  function compile(src, dist) {
    return  src
      .pipe($.sass({outputStyle:'compressed'}).on('error', $.sass.logError))
      .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
      .pipe(gulp.dest(dist))
      .pipe($.size({title: 'components-style'}));
      
  }

  return merge(
    compile(gulp.src(['www/static/css/components/**/*.scss']), 'www/static/css/components')
  );
})
gulp.task('watch-components-css', cb => {
  gulp.watch(['www/static/css/components/**/*.scss'], ['components-style']);
});

gulp.task("components-js",() => {
  function compile(src, dist) {
    return  src
      //.pipe($.uglify())
      .pipe($.minify())
      .pipe(gulp.dest(dist))
      .pipe($.size({title: 'components-js'}));

  }

  return merge(
    compile(gulp.src(['www/static/js/components/**/main.js']), 'www/static/js/components')
  );
})
gulp.task('watch-components-js', cb => {
  gulp.watch(['www/static/js/components/**/main.js'], ['components-js']);
});
// Compile components
gulp.task('watch-components', ['watch-components-js', 'watch-components-css']);

// 合并、压缩basejs文件
gulp.task('basejs', function() {
  return gulp.src('www/static/js/base/*.js')
    .pipe($.concat('baseall.js'))
    .pipe(gulp.dest('www/static/js'))
    .pipe($.rename({ suffix: '.min' }))
    .pipe($.uglify())
    .pipe(gulp.dest('www/static/minjs'))
    .pipe($.notify({ message: 'baseall js task ok' }))
    ;
});

// 合并、压缩 component css文件
gulp.task('componentsCss', function() {
  return gulp.src('www/static/css/components/*/main.css')
    .pipe($.concat('componentsall.css'))
    //.pipe($.rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('www/static/css/components'))
    .pipe($.notify({ message: 'componentsall css task ok' }))
    ;
});

// 复制文件 js
gulp.task('copyjs', function () {
    return gulp.src('www/static/js/*/*')
        .pipe(gulp.dest('www/static/minjs/'));
});
// 合并、压缩、重命名css
gulp.task('css', function() {
  return gulp.src('src/css/*.css')
    .pipe(concat('main.css'))
    .pipe(gulp.dest('dest/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('dest/css'))
    .pipe(notify({ message: 'css task ok' }));
});

