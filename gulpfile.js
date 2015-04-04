'use strict';

var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    gjslint = require('gulp-gjslint'),
    server = require('./server.js');

gulp.task('start-test-server', function(done) {
  server.start();
  done();
});

gulp.task('test', ['start-test-server'], function(done) {
  gulp.src('./test/test.js', {read: false})
    .pipe(mocha({reporter: 'spec'}))
    .once('end', function() {
      server.stop();
      done();
    });
});


gulp.task('lint', function(done) {
  return gulp.src(['./*.js', './src/*.js', './model/*.js'])
    .pipe(gjslint({
      flags: ['--nojsdoc']
    }))
    .pipe(gjslint.reporter('console'));
});

