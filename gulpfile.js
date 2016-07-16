var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('compile', ['compile-es6']);

gulp.task('compile-es6', function() {
  return gulp.src('Lambbit.jsx')
    .pipe($.babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('.'));
});
