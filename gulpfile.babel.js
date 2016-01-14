'use strict';

import gulp from 'gulp';
import merge from 'merge-stream';
import gulpLoadplugin from 'gulp-load-plugins';

const $ = gulpLoadplugin();


gulp.task("components-style",() => {
  const AUTOPREFIXER_BROWSERS = [
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
      .pipe($.uglify())
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

