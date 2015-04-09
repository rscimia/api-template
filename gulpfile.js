'use strict';

var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    gjslint = require('gulp-gjslint'),
    server = require('./server.js'),
    fs = require('fs');

gulp.task('override-test-data', function(done) {
  fs.writeFile(
    './test/data.json',
    JSON.stringify({
      bills:[{
          id: 'alreadyThereBill',
          seller: 'test seller',
          amount: 50
        }]
    }),
    function(err) {
      done();
    });
});

gulp.task('start-test-server', ['override-test-data'], function(done) {
  server
    .settings(require('./config/config-test.json'))
    .settings('dataFile', 'test/data.json')
    .start();
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
